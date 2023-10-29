import { extensionColorMap } from "./extensionColorMap";

export const getExtensionColor = (extension: string): string => {
  if (extensionColorMap[extension]) {
    return extensionColorMap[extension];
  }

  const hash = [...extension.repeat(3)].reduce((accumulator, char) => {
    return char.charCodeAt(0) + ((accumulator << 5) - accumulator);
  }, 0);

  return `hsl(${hash % 360}, 80%, 60%)`;
};
