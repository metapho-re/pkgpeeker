import { BaseTag } from "./BaseTag";

interface Props {
  keywords: string;
}

export const KeywordsTag = ({ keywords }: Props) => (
  <BaseTag type="keywords" title={keywords}>
    Keywords
  </BaseTag>
);
