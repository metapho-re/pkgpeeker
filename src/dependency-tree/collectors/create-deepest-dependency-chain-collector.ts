import type { PackageIdentifier } from "../types";

import type { CollectorNode, TreeCollector } from "./types";

export const createDeepestDependencyChainCollector = (): TreeCollector<
  PackageIdentifier[] | null
> => {
  let deepestDependencyChain: PackageIdentifier[] | null = null;

  return {
    collect({ packageInformation }: CollectorNode) {
      if (
        !packageInformation.isDeduped &&
        packageInformation.dependencyPath.length >
          (deepestDependencyChain?.length || 1)
      ) {
        deepestDependencyChain = packageInformation.dependencyPath;
      }
    },
    getResult() {
      return deepestDependencyChain;
    },
  };
};
