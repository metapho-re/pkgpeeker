import { WebContainer } from "@webcontainer/api";
import {
  DependencyTreeData,
  NpmDependencyTree,
  PackageDataIndex,
} from "../types";
import { getDependencyTree } from "./getDependencyTree";
import { getNestedDependencyPaths } from "./getNestedDependencyPaths";

interface Props {
  webContainerInstance: WebContainer | undefined;
  npmDependencyTree: NpmDependencyTree;
}

export const getDependencyTreeData = async ({
  webContainerInstance,
  npmDependencyTree,
}: Props): Promise<DependencyTreeData | null> => {
  const nestedDependencyPaths = await getNestedDependencyPaths(
    webContainerInstance
  );

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
