import type { DependencyTree } from "../../../types";

interface TransitiveStatistics {
  uniqueDependencyCount: number;
  totalSize: number;
}

export const getTransitiveStatistics = (
  dependencies: DependencyTree,
): TransitiveStatistics => {
  const paths = new Set<string>();

  let totalSize = 0;

  const walk = (tree: DependencyTree) => {
    for (const packageInformation of Object.values(tree)) {
      if (!paths.has(packageInformation.installationPath)) {
        totalSize +=
          packageInformation.folderStatistics?.folderSizeInBytes ?? 0;
        paths.add(packageInformation.installationPath);
      }

      walk(packageInformation.dependencies);
    }
  };

  walk(dependencies);

  return { uniqueDependencyCount: paths.size, totalSize };
};
