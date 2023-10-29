import { FileDetails, FolderStatistics } from "../types";

export const getFolderStatistics = (
  folderComposition: FileDetails[]
): FolderStatistics =>
  folderComposition.reduce<FolderStatistics>(
    (previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue.extension]:
          (previousValue[currentValue.extension] || 0) +
          currentValue.sizeInBytes,
        folderSizeInBytes:
          previousValue.folderSizeInBytes + currentValue.sizeInBytes,
        numberOfFilesInFolder: previousValue.numberOfFilesInFolder + 1,
      };
    },
    { folderSizeInBytes: 0, numberOfFilesInFolder: 0 }
  );
