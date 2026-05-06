import type {
  DependencyAnalysis,
  PackageInformation,
} from "../../dependency-tree";

import { getTransitiveStatistics } from "./get-transitive-statistics";
import type { Row } from "./types";

export const getSizeData = (dependencyAnalysis: DependencyAnalysis): Row[] => {
  const packagesMap = new Map<
    string,
    { packageName: string } & PackageInformation
  >();

  for (const entry of Object.values(dependencyAnalysis.flatIndex)) {
    if (!entry.folderStatistics) {
      continue;
    }

    const existing = packagesMap.get(entry.installationPath);

    if (!existing || (!entry.isDeduped && existing.isDeduped)) {
      packagesMap.set(entry.installationPath, entry);
    }
  }

  const { dependents } = dependencyAnalysis;

  return Array.from(packagesMap.values()).map((entry) => {
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
      dependents: dependents[entry.packageName] ?? [],
      dependentCount: (dependents[entry.packageName] ?? []).length,
      dependenciesSize: totalSize,
      depth: entry.depth,
    };
  });
};
