import { DependencyTree } from "../../types";

export const getTotalDependenciesSize = (
  dependencyTree: DependencyTree,
): number =>
  Object.values(dependencyTree).reduce((totalSize, packageInformation) => {
    const folderSize =
      packageInformation.folderStatistics?.folderSizeInBytes ?? 0;

    return (
      totalSize +
      folderSize +
      getTotalDependenciesSize(packageInformation.dependencies)
    );
  }, 0);
