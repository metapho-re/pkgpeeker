import {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from "react";
import "./Popover.css";

const popoverArrowHeight = 8;

interface Props {
  content: ReactNode;
}

export const Popover = ({ content, children }: PropsWithChildren<Props>) => {
  const ref = useRef<HTMLDivElement>(null);

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [display, setDisplay] = useState("none");

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    const {
      left: targetLeft = 0,
      right: targetRight = 0,
      bottom = 0,
    } = ref.current?.getBoundingClientRect() || {};

    setTop(bottom + window.scrollY + popoverArrowHeight);
    setLeft(targetLeft + (targetRight - targetLeft) / 2);
    setDisplay("block");
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setDisplay("none");
  };

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      <div style={{ display, top, left }} className="popover">
        {content}
      </div>
    </>
  );
};
