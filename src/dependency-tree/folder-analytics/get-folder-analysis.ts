import type { FileDetails, FolderStatistics, LargestFile } from "./types";

interface FolderAnalysis {
  folderStatistics: FolderStatistics;
  largestFile: LargestFile | null;
}

export const getFolderAnalysis = (
  folderComposition: FileDetails[],
): FolderAnalysis => {
  const folderStatistics: FolderStatistics = {
    folderSizeInBytes: 0,
    numberOfFilesInFolder: 0,
  };
  let largestFile: LargestFile | null = null;

  for (const file of folderComposition) {
    folderStatistics.folderSizeInBytes += file.sizeInBytes;
    folderStatistics.numberOfFilesInFolder += 1;
    folderStatistics[file.extension] =
      (folderStatistics[file.extension] || 0) + file.sizeInBytes;

    if (file.sizeInBytes > (largestFile?.sizeInBytes || 0)) {
      largestFile = {
        filePath: file.filePath,
        sizeInBytes: file.sizeInBytes,
      };
    }
  }

  return { folderStatistics, largestFile };
};
