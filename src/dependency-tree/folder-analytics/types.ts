export interface FileDetails {
  extension: string;
  filePath: string;
  sizeInBytes: number;
}

export interface FolderStatistics extends Record<string, number> {
  folderSizeInBytes: number;
  numberOfFilesInFolder: number;
}

export interface LargestFile {
  filePath: string;
  sizeInBytes: number;
}
