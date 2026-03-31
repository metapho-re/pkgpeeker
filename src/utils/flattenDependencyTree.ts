import { DependencyTree, PackageInformation } from "../types";

export type FlatDependencyIndex = Record<
  string,
  { packageName: string } & PackageInformation
>;

const walk = (tree: DependencyTree, index: FlatDependencyIndex): void => {
  for (const [packageName, packageInformation] of Object.entries(tree)) {
    index[packageInformation.installationPath] = {
      packageName,
      ...packageInformation,
    };

    if (Object.keys(packageInformation.dependencies).length > 0) {
      walk(packageInformation.dependencies, index);
    }
  }
};

export const flattenDependencyTree = (
  tree: DependencyTree,
): FlatDependencyIndex => {
  const index: FlatDependencyIndex = {};

  walk(tree, index);

  return index;
};
