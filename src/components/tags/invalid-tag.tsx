import { BaseTag } from "./base-tag";

interface Props {
  invalidityDetails: string;
}

export const InvalidTag = ({ invalidityDetails }: Props) => (
  <BaseTag type="invalid" title={invalidityDetails}>
    Invalid
  </BaseTag>
);
