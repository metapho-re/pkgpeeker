import { BaseTag } from "./BaseTag";

export const DedupedTag = () => (
  <BaseTag
    type="deduped"
    title="Deduped packages are those moved further up the dependency tree, where they can be more effectively shared by multiple dependent packages."
  >
    Deduped
  </BaseTag>
);
