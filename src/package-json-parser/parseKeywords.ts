export const parseKeywords = (
  keywords: string[] | string | undefined
): string | null => {
  if (Array.isArray(keywords)) {
    return keywords.join(", ");
  }

  // Support for invalid yet not uncommon syntax
  if (typeof keywords === "string") {
    return keywords;
  }

  return null;
};
