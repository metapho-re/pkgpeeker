import type {
  DependencyTree,
  DependencyTreeData,
  LargestFileDetails,
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
  largestFileDetails: LargestFileDetails | null;
}

export interface SizeCompositionData {
  totalSize: number;
  maxSize: number;
  totalFileCount: number;
  packageSizeEntries: [string, number][];
  extensionSizeEntries: Record<string, number>;
  largestFileDetails: {
    packageName: string;
    filePath: string;
    sizeInBytes: number;
  } | null;
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
    largestFileDetails: entry.largestFileDetails,
  }));
};

export const getSizeCompositionData = (rows: Row[]): SizeCompositionData => {
  let totalSize = 0;
  let maxSize = 0;
  let totalFileCount = 0;
  let largestFileDetails: SizeCompositionData["largestFileDetails"] = null;

  const extensionSizeMap: Record<string, number> = {};
  const packageSizeEntries: [string, number][] = [];

  for (const row of rows) {
    totalSize += row.size;
    totalFileCount += row.fileCount;

    if (row.size > maxSize) {
      maxSize = row.size;
    }

    packageSizeEntries.push([
      `${row.packageInformation.packageName}@${row.packageInformation.version}`,
      row.size,
    ]);

    if (
      row.largestFileDetails &&
      row.largestFileDetails.sizeInBytes >
        (largestFileDetails?.sizeInBytes || 0)
    ) {
      largestFileDetails = {
        packageName: row.packageInformation.packageName,
        filePath: row.largestFileDetails.filePath.slice(
          `${row.installationPath}/`.length,
        ),
        sizeInBytes: row.largestFileDetails.sizeInBytes,
      };
    }

    if (row.packageInformation.folderStatistics) {
      for (const [key, value] of Object.entries(
        row.packageInformation.folderStatistics,
      )) {
        if (key === "folderSizeInBytes" || key === "numberOfFilesInFolder") {
          continue;
        }

        extensionSizeMap[key] = (extensionSizeMap[key] || 0) + value;
      }
    }
  }

  packageSizeEntries.sort(([, a], [, b]) => b - a);

  const extensionSizeEntries: Record<string, number> = Object.fromEntries(
    Object.entries(extensionSizeMap).sort(([, a], [, b]) => b - a),
  );

  return {
    totalSize,
    maxSize,
    totalFileCount,
    packageSizeEntries,
    extensionSizeEntries,
    largestFileDetails,
  };
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
