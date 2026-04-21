import type {
  LargestFileDetails,
  PackageIdentifier,
  PackageInformation,
} from "../../../types";

export type SortKey =
  | "size"
  | "fileCount"
  | "directDependencyCount"
  | "transitiveDependencyCount"
  | "dependenciesSize"
  | "depth"
  | "name";

export type SortDirection = "asc" | "desc";

export interface Row {
  packageInformation: { packageName: string } & PackageInformation;
  installationPath: string;
  size: number;
  fileCount: number;
  directDependencyCount: number;
  transitiveDependencyCount: number;
  dependenciesSize: number;
  depth: number;
  largestFileDetails: LargestFileDetails | null;
}

export interface SizeCompositionData {
  totalSize: number;
  maxSize: number;
  totalFileCount: number;
  uniquePackageCount: number;
  packageSizeEntries: [string, number][];
  extensionSizeEntries: Record<string, number>;
  largestFileDetails: {
    packageName: string;
    filePath: string;
    sizeInBytes: number;
  } | null;
}

export interface SizeData {
  rows: Row[];
  deepestDependencyChain: PackageIdentifier[] | null;
}
