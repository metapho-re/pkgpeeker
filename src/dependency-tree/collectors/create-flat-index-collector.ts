import { getTreePath } from "../../shared";

import type { FlatDependencyIndex } from "../types";

import type { CollectorNode, TreeCollector } from "./types";

export const createFlatIndexCollector =
  (): TreeCollector<FlatDependencyIndex> => {
    const flatIndex: FlatDependencyIndex = {};

    return {
      collect({ packageName, packageInformation }: CollectorNode) {
        const treePath = getTreePath(packageInformation.dependencyPath);

        flatIndex[treePath] = { packageName, ...packageInformation };
      },
      getResult() {
        return flatIndex;
      },
    };
  };
