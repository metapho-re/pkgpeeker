import { BaseTag } from "./BaseTag";

export const DedupedTag = () => (
  <BaseTag
    type="deduped"
    title={
      <span>
        Deduped packages are those moved further up the dependency tree,
        <br />
        where they can be more effectively shared by multiple dependent
        packages.
      </span>
    }
  >
    Deduped
  </BaseTag>
);
