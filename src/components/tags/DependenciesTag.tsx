import { BaseTag } from "./BaseTag";

interface Props {
  count: number;
}

export const DependenciesTag = ({ count }: Props) => (
  <BaseTag
    type="dependencies"
    title="Number of direct dependencies"
  >{`Deps: ${count}`}</BaseTag>
);
