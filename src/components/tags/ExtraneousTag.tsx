import { BaseTag } from "./BaseTag";

export const ExtraneousTag = () => (
  <BaseTag
    type="extraneous"
    title="Extraneous packages are those present in the node_modules folder that are not listed as any package's dependency list."
  >
    Extraneous
  </BaseTag>
);
