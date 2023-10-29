type Nullable<T> = T | null;

export type AppState =
  | "idle"
  | "booting"
  | "ready"
  | "installing"
  | "crunching"
  | "done";

export interface Author {
  name: string;
  email?: string;
  url?: string;
}

export type DependencyTree = Record<string, PackageInformation>;

export interface DependencyTreeData {
  dependencyTree: DependencyTree;
  maxDepth: number;
}

export interface FileDetails {
  extension: string;
  sizeInBytes: number;
}

export interface FolderStatistics extends Record<string, number> {
  folderSizeInBytes: number;
  numberOfFilesInFolder: number;
}

export type NpmDependencyTree = Record<string, NpmPackageInformation>;

export interface NpmPackageInformation {
  version?: string;
  resolved?: string;
  overridden?: boolean;
  extraneous?: boolean;
  invalid?: string;
  problems?: string[];
  dependencies?: NpmDependencyTree;
}

export type PackageDataIndex = Record<
  string,
  Pick<PackageInformation, "folderStatistics" | "packageMetadata">
>;

export interface PackageInformation {
  depth: number;
  isDeduped: boolean;
  isExtraneous: boolean;
  invalidityDetails: string | null;
  version: string;
  installationPath: string;
  dependencyPath: string[];
  folderStatistics: FolderStatistics | null;
  packageMetadata: PackageMetadata | null;
  dependencies: DependencyTree;
}

export interface PackageMetadata {
  author: Nullable<Author>;
  description: Nullable<string>;
  homepage: Nullable<string>;
  license: Nullable<string>;
  repository: Nullable<string>;
}
