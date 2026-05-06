import type { MostDependedOnPackage } from "../types";

import type { CollectorNode, TreeCollector } from "./types";

export const createReverseDependencyCollector = (): TreeCollector<{
  dependents: Record<string, string[]>;
  mostDependedOnPackage: MostDependedOnPackage | null;
}> => {
  const reverseDependencyMap = new Map<string, Set<string>>();

  return {
    collect({ packageName, packageInformation }: CollectorNode) {
      if (packageInformation.isDeduped) {
        return;
      }

      for (const dependencyName of Object.keys(
        packageInformation.dependencies,
      )) {
        const dependentPackages = reverseDependencyMap.get(dependencyName);

        if (dependentPackages) {
          dependentPackages.add(packageName);
        } else {
          reverseDependencyMap.set(dependencyName, new Set([packageName]));
        }
      }
    },
    getResult() {
      const dependents: Record<string, string[]> = {};
      let mostDependedOnPackage: MostDependedOnPackage | null = null;

      for (const [dependencyName, dependentPackages] of reverseDependencyMap) {
        const sortedDependentPackages = [...dependentPackages].sort();
        dependents[dependencyName] = sortedDependentPackages;

        if (
          !mostDependedOnPackage ||
          sortedDependentPackages.length > mostDependedOnPackage.dependentCount
        ) {
          mostDependedOnPackage = {
            name: dependencyName,
            dependentCount: sortedDependentPackages.length,
          };
        }
      }

      return { dependents, mostDependedOnPackage };
    },
  };
};
