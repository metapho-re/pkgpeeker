import { BaseTag } from "./base-tag";

interface Props {
  engines: string;
}

export const EnginesTag = ({ engines }: Props) => (
  <BaseTag type="engines" title={`This package requires Node.js ${engines}.`}>
    Node {engines}
  </BaseTag>
);
