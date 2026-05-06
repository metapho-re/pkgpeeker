import type { PackageInformation } from "../../dependency-tree";

export type SortKey =
  | "size"
  | "fileCount"
  | "directDependencyCount"
  | "transitiveDependencyCount"
  | "dependentCount"
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
  dependents: string[];
  dependentCount: number;
  dependenciesSize: number;
  depth: number;
}

export interface SizeCompositionData {
  totalSize: number;
  maxSize: number;
  totalFileCount: number;
  uniquePackageCount: number;
  leafPackageCount: number;
  packageSizeEntries: [string, number][];
  extensionSizeEntries: Record<string, number>;
}

export interface ConcentrationData {
  count: number;
  percentage: number;
  packageNames: string[];
}

export interface OutlierEntry {
  packageName: string;
  version: string;
  size: number;
  fileCount: number;
  bytesPerFile: number;
  kind: "bundled" | "fragmented";
}

export interface OutlierData {
  concentration: ConcentrationData | null;
  outliers: OutlierEntry[];
}
