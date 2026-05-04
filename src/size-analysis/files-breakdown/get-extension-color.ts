import { EXTENSION_COLOR_MAP } from "./extension-color-map";

export const getExtensionColor = (extension: string): string =>
  EXTENSION_COLOR_MAP[extension] ?? EXTENSION_COLOR_MAP.other;
