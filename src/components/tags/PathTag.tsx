import { BaseTag } from "./BaseTag";

interface Props {
  path: string;
}

export const PathTag = ({ path }: Props) => (
  <BaseTag
    type="path"
    title="Path of the package inside the installation folder"
  >
    {path}
  </BaseTag>
);
