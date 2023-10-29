import { BaseTag } from "./BaseTag";

interface Props {
  invalidityDetails: string;
}

export const InvalidTag = ({ invalidityDetails }: Props) => (
  <BaseTag type="invalid" title={invalidityDetails}>
    Invalid
  </BaseTag>
);
