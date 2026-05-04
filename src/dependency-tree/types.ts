import type { FolderStatistics, LargestFileDetails } from "./folder-analytics";
import type { PackageMetadata } from "./package-json-parser";

export type DependencyTree = Record<string, PackageInformation>;

export interface DependencyTreeData {
  dependencyTree: DependencyTree;
  maxDepth: number;
}

export type NestedDependencyPaths = Record<string, PackageIdentifier[][]>;

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
  Pick<
    PackageInformation,
    "folderStatistics" | "largestFileDetails" | "packageMetadata"
  >
>;

export interface PackageIdentifier {
  name: string;
  version: string;
}

export interface PackageInformation {
  depth: number;
  isDeduped: boolean;
  isExtraneous: boolean;
  invalidityDetails: string | null;
  version: string;
  installationPath: string;
  dependencyPath: PackageIdentifier[];
  folderStatistics: FolderStatistics | null;
  largestFileDetails: LargestFileDetails | null;
  packageMetadata: PackageMetadata | null;
  dependencies: DependencyTree;
}
