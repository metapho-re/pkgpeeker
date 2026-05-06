import type { WebContainer } from "@webcontainer/api";

import { createCollectorRunner } from "../collectors";
import type {
  DependencyAnalysis,
  NpmDependencyTree,
  PackageDataIndex,
} from "../types";

import { getDependencyTree } from "./get-dependency-tree";
import { getNestedDependencyPaths } from "./get-nested-dependency-paths";

interface Params {
  webContainerInstance: WebContainer | null;
  npmDependencyTree: NpmDependencyTree;
}

export const getDependencyAnalysis = async ({
  webContainerInstance,
  npmDependencyTree,
}: Params): Promise<DependencyAnalysis | null> => {
  const nestedDependencyPaths =
    await getNestedDependencyPaths(webContainerInstance);

  if (!nestedDependencyPaths) {
    return null;
  }

  const collectorRunner = createCollectorRunner();
  const packageDataIndex: PackageDataIndex = {};
  const maxDepth = { value: 0 };

  const dependencyTree = await getDependencyTree({
    webContainerInstance,
    npmDependencyTree,
    collectorRunner,
    nestedDependencyPaths,
    packageDataIndex,
    maxDepth,
    depth: 0,
    dependencyPath: [],
  });

  return {
    dependencyTree,
    maxDepth: maxDepth.value,
    ...collectorRunner.getResults(),
  };
};
