import { Author } from "../types";

const getUrlObject = (
  url: string | undefined
): { url: string } | Record<string, never> => {
  if (url && url.indexOf("http") < 0) {
    return { url: `http://${url}` };
  }

  if (url) {
    return { url };
  }

  return {};
};

type AuthorProperty = "name" | "email" | "url";

export const parseAuthor = (
  author: string | Author | undefined
): Author | null => {
  if (!author) {
    return null;
  }

  if (typeof author !== "string") {
    const urlObject = getUrlObject(author.url);

    return {
      ...author,
      ...urlObject,
    };
  }

  const parsedValue = author.split("").reduce<{
    parsedField: AuthorProperty | null;
    name: string;
    email: string;
    url: string;
  }>(
    (previousValue, currentValue) => {
      switch (true) {
        case currentValue === ">":
        case currentValue === ")": {
          return {
            ...previousValue,
            parsedField: null,
          };
        }
        case currentValue === "<": {
          return {
            ...previousValue,
            parsedField: "email",
          };
        }
        case currentValue === "(": {
          return {
            ...previousValue,
            parsedField: "url",
          };
        }
        case previousValue.parsedField !== null: {
          return {
            ...previousValue,
            [previousValue.parsedField as AuthorProperty]: `${
              previousValue[previousValue.parsedField as AuthorProperty]
            }${currentValue}`,
          };
        }
        default: {
          return previousValue;
        }
      }
    },
    { parsedField: "name", name: "", email: "", url: "" }
  );

  const emailObject =
    parsedValue.email.trim().length > 0
      ? { email: parsedValue.email.trim() }
      : {};

  const urlObject = getUrlObject(parsedValue.url.trim());

  return {
    name: parsedValue.name.trim(),
    ...emailObject,
    ...urlObject,
  };
};
