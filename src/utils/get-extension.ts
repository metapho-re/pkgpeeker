const COMPOUND_EXTENSIONS = [".d.ts", ".d.mts", ".d.cts"];

export const getExtension = (fileName: string): string => {
  for (const extension of COMPOUND_EXTENSIONS) {
    if (fileName.endsWith(extension)) {
      return extension;
    }
  }

  const lastDot = fileName.lastIndexOf(".");

  if (lastDot > 0) {
    return fileName.slice(lastDot).toLowerCase();
  }

  return "other";
};
