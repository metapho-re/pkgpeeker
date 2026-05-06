import type { LargestFileMatch } from "./collectors";
import type { FolderStatistics, LargestFile } from "./folder-analytics";
import type { PackageMetadata } from "./package-json-parser";

export type PackageDataIndex = Record<
  string,
  {
    folderStatistics: FolderStatistics | null;
    largestFile: LargestFile | null;
    packageMetadata: PackageMetadata | null;
  }
>;

export type DependencyTree = Record<string, PackageInformation>;

export type FlatDependencyIndex = Record<
  string,
  { packageName: string } & PackageInformation
>;

export interface MostDependedOnPackage {
  name: string;
  dependentCount: number;
}

export interface DependencyTreeData {
  dependencyTree: DependencyTree;
  maxDepth: number;
  flatIndex: FlatDependencyIndex;
  deepestDependencyChain: PackageIdentifier[] | null;
  largestFileMatch: LargestFileMatch | null;
  mostDependedOnPackage: MostDependedOnPackage | null;
  dependents: Record<string, string[]>;
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
  packageMetadata: PackageMetadata | null;
  dependencies: DependencyTree;
}
