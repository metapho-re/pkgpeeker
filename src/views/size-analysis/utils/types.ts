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
  leafPackageCount: number;
  packageSizeEntries: [string, number][];
  extensionSizeEntries: Record<string, number>;
  largestFileDetails: {
    packageName: string;
    filePath: string;
    sizeInBytes: number;
  } | null;
}

export interface MostDependedOnPackage {
  name: string;
  dependentCount: number;
}

export interface ConcentrationData {
  count: number;
  percentage: number;
  packageNames: string[];
}

export interface MismatchEntry {
  packageName: string;
  version: string;
  size: number;
  fileCount: number;
  bytesPerFile: number;
  kind: "bundled" | "fragmented";
}

export interface OutlierData {
  concentration: ConcentrationData | null;
  mismatches: MismatchEntry[];
}

export interface SizeData {
  rows: Row[];
  deepestDependencyChain: PackageIdentifier[] | null;
  mostDependedOnPackage: MostDependedOnPackage | null;
}
