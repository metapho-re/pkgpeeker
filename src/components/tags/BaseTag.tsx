import { PropsWithChildren } from "react";
import "./Tags.css";

interface Props {
  type:
    | "depth"
    | "license"
    | "path"
    | "keywords"
    | "deduped"
    | "extraneous"
    | "invalid";
  title: string;
}

export const BaseTag = ({
  type,
  title,
  children,
}: PropsWithChildren<Props>) => (
  <div>
    <span className={`tag tag_${type}`} title={title}>
      {children}
    </span>
  </div>
);
