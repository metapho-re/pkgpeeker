import {
  DependencyTree,
  DependencyTreeData,
  PackageInformation,
} from "../../types";
import { flattenDependencyTree, getTotalDependenciesSize } from "../../utils";

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
}

export const getUniqueTransitiveDependenciesCount = (
  dependencies: DependencyTree,
): number => {
  const paths = new Set<string>();

  const walk = (dependencyTree: DependencyTree) => {
    for (const packageInformation of Object.values(dependencyTree)) {
      paths.add(packageInformation.installationPath);

      walk(packageInformation.dependencies);
    }
  };

  walk(dependencies);

  return paths.size;
};

export const getRows = (dependencyTreeData: DependencyTreeData): Row[] => {
  const flatIndex = flattenDependencyTree(dependencyTreeData.dependencyTree);

  const packagesMap = new Map<
    string,
    { packageName: string } & PackageInformation
  >();

  for (const entry of Object.values(flatIndex)) {
    if (!entry.folderStatistics) {
      continue;
    }

    const packageInformation = packagesMap.get(entry.installationPath);

    if (
      !packageInformation ||
      (!entry.isDeduped && packageInformation.isDeduped)
    ) {
      packagesMap.set(entry.installationPath, entry);
    }
  }

  return Array.from(packagesMap.values()).map((entry) => ({
    packageInformation: entry,
    installationPath: entry.installationPath,
    size: entry.folderStatistics!.folderSizeInBytes,
    fileCount: entry.folderStatistics!.numberOfFilesInFolder,
    directDependencyCount: Object.keys(entry.dependencies).length,
    transitiveDependencyCount: getUniqueTransitiveDependenciesCount(
      entry.dependencies,
    ),
    dependenciesSize: getTotalDependenciesSize(entry.dependencies),
    depth: entry.depth,
  }));
};

interface Params {
  rows: Row[];
  sortKey: SortKey;
  sortDirection: SortDirection;
}

export const getSortedRows = ({
  rows,
  sortKey,
  sortDirection,
}: Params): Row[] => {
  const multiplier = sortDirection === "desc" ? -1 : 1;

  return [...rows].sort((a, b) => {
    const tieBreaker = a.packageInformation.packageName.localeCompare(
      b.packageInformation.packageName,
    );

    const comparison =
      sortKey === "name" ? tieBreaker : a[sortKey] - b[sortKey];

    return (comparison || tieBreaker) * multiplier;
  });
};
