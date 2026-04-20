import type {
  FileDetails,
  FolderStatistics,
  LargestFileDetails,
} from "../../types";

interface FolderAnalysis {
  folderStatistics: FolderStatistics;
  largestFileDetails: LargestFileDetails | null;
}

export const getFolderAnalysis = (
  folderComposition: FileDetails[],
): FolderAnalysis => {
  const folderStatistics: FolderStatistics = {
    folderSizeInBytes: 0,
    numberOfFilesInFolder: 0,
  };
  let largestFileDetails: LargestFileDetails | null = null;

  for (const file of folderComposition) {
    folderStatistics.folderSizeInBytes += file.sizeInBytes;
    folderStatistics.numberOfFilesInFolder += 1;
    folderStatistics[file.extension] =
      (folderStatistics[file.extension] || 0) + file.sizeInBytes;

    if (file.sizeInBytes > (largestFileDetails?.sizeInBytes || 0)) {
      largestFileDetails = {
        filePath: file.filePath,
        sizeInBytes: file.sizeInBytes,
      };
    }
  }

  return { folderStatistics, largestFileDetails };
};
