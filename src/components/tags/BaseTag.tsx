import { PropsWithChildren, ReactNode } from "react";
import { Popover } from "../popover";
import "./Tags.css";

interface Props {
  type:
    | "depth"
    | "license"
    | "path"
    | "keywords"
    | "deduped"
    | "extraneous"
    | "invalid"
    | "types";
  title: ReactNode;
}

export const BaseTag = ({
  type,
  title,
  children,
}: PropsWithChildren<Props>) => (
  <Popover content={title}>
    <span className={`tag tag_${type}`}>{children}</span>
  </Popover>
);
