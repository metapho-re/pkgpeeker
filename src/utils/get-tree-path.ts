import type { PackageIdentifier } from "../types";

export const getTreePath = (dependencyPath: PackageIdentifier[]): string =>
  dependencyPath.map(({ name, version }) => `${name}@${version}`).join("/");
