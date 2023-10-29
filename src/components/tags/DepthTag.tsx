import { BaseTag } from "./BaseTag";

interface Props {
  depth: number;
}

export const DepthTag = ({ depth }: Props) => (
  <BaseTag
    type="depth"
    title="Depth of the package inside the dependency tree"
  >{`Depth: ${depth}`}</BaseTag>
);
