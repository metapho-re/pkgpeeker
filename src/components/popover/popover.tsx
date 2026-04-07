import "./popover.css";

import {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const POPOVER_GAP = 10;

interface Props {
  content: ReactNode;
}

export const Popover = ({ content, children }: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLSpanElement>(null);

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleMouseEnter: MouseEventHandler<HTMLSpanElement> = () => {
    const rect = ref.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setTop(rect.bottom + POPOVER_GAP);
    setLeft(rect.left + rect.width / 2);
    setVisible(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLSpanElement> = () => {
    setVisible(false);
  };

  return (
    <>
      <span
        ref={ref}
        className="popover-anchor"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {visible &&
        content &&
        createPortal(
          <div style={{ top, left }} className="popover">
            {content}
          </div>,
          document.body,
        )}
    </>
  );
};
