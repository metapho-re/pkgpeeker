import { BaseTag } from "./BaseTag";

export const ExtraneousTag = () => (
  <BaseTag
    type="extraneous"
    title={
      <span>
        Extraneous packages are those present in the node_modules folder
        <br /> that are not listed as any package's dependency list.
      </span>
    }
  >
    Extraneous
  </BaseTag>
);
