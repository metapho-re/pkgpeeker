import { BaseTag } from "./base-tag";

interface Props {
  keywords: string;
}

export const KeywordsTag = ({ keywords }: Props) => (
  <>
    {keywords.split(",").map((keyword) => {
      const trimmedKeyword = keyword.trim();

      return (
        <BaseTag
          key={trimmedKeyword}
          type="keywords"
          title="Package keyword from package.json"
        >
          {trimmedKeyword}
        </BaseTag>
      );
    })}
  </>
);
