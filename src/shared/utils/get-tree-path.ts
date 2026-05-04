import type { PackageIdentifier } from "../../dependency-tree";

export const getTreePath = (dependencyPath: PackageIdentifier[]): string =>
  dependencyPath.map(({ name, version }) => `${name}@${version}`).join("/");
