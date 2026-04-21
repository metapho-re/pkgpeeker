import type {
  DependencyTreeData,
  PackageIdentifier,
  PackageInformation,
} from "../../../types";
import { flattenDependencyTree } from "../../../utils";

import { getTransitiveStatistics } from "./get-transitive-statistics";
import type { Row, SizeData } from "./types";

export const getSizeData = (
  dependencyTreeData: DependencyTreeData,
): SizeData => {
  const flatIndex = flattenDependencyTree(dependencyTreeData.dependencyTree);

  const packagesMap = new Map<
    string,
    { packageName: string } & PackageInformation
  >();
  let deepestDependencyChain: PackageIdentifier[] | null = null;

  for (const entry of Object.values(flatIndex)) {
    if (
      !entry.isDeduped &&
      entry.dependencyPath.length > (deepestDependencyChain?.length || 0)
    ) {
      deepestDependencyChain = entry.dependencyPath;
    }

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

  const rows: Row[] = Array.from(packagesMap.values()).map((entry) => {
    const { uniqueDependencyCount, totalSize } = getTransitiveStatistics(
      entry.dependencies,
    );

    return {
      packageInformation: entry,
      installationPath: entry.installationPath,
      size: entry.folderStatistics!.folderSizeInBytes,
      fileCount: entry.folderStatistics!.numberOfFilesInFolder,
      directDependencyCount: Object.keys(entry.dependencies).length,
      transitiveDependencyCount: uniqueDependencyCount,
      dependenciesSize: totalSize,
      depth: entry.depth,
      largestFileDetails: entry.largestFileDetails,
    };
  });

  return { rows, deepestDependencyChain };
};
