import type { MostDependedOnPackage } from "../types";

import type { CollectorNode, TreeCollector } from "./types";

export const createReverseDependencyCollector =
  (): TreeCollector<MostDependedOnPackage | null> => {
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
        let result: MostDependedOnPackage | null = null;

        for (const [
          dependencyName,
          dependentPackages,
        ] of reverseDependencyMap) {
          if (!result || dependentPackages.size > result.dependentCount) {
            result = {
              name: dependencyName,
              dependentCount: dependentPackages.size,
            };
          }
        }

        return result;
      },
    };
  };
