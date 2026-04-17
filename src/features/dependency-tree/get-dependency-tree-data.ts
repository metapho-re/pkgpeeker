import type { WebContainer } from "@webcontainer/api";

import type {
  DependencyTreeData,
  NpmDependencyTree,
  PackageDataIndex,
} from "../../types";

import { getDependencyTree } from "./get-dependency-tree";
import { getNestedDependencyPaths } from "./get-nested-dependency-paths";

interface Params {
  webContainerInstance: WebContainer | null;
  npmDependencyTree: NpmDependencyTree;
}

export const getDependencyTreeData = async ({
  webContainerInstance,
  npmDependencyTree,
}: Params): Promise<DependencyTreeData | null> => {
  const nestedDependencyPaths =
    await getNestedDependencyPaths(webContainerInstance);

  if (!nestedDependencyPaths) {
    return null;
  }

  const packageDataIndex: PackageDataIndex = {};
  const maxDepth = { value: 0 };

  const dependencyTree = await getDependencyTree({
    webContainerInstance,
    npmDependencyTree,
    nestedDependencyPaths,
    packageDataIndex,
    maxDepth,
    depth: 0,
    dependencyPath: [],
  });

  return {
    dependencyTree,
    maxDepth: maxDepth.value,
  };
};
