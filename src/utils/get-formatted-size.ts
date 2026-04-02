const unitsList = ["B", "KB", "MB", "GB", "TB"];
const trailingZerosRegExp = /\.0*$/g;

export const getFormattedSize = (sizeInBytes: number): string => {
  if (sizeInBytes === 0) {
    return "N/A";
  }

  const unitsListIndex = Math.floor(Math.log(sizeInBytes) / Math.log(1024));

  return `${(sizeInBytes / Math.pow(1024, unitsListIndex))
    .toFixed(1)
    .replace(trailingZerosRegExp, "")}${unitsList[unitsListIndex]}`;
};
