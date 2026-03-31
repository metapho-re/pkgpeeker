import { PackageIdentifier } from "../types";
import { FlatDependencyIndex } from "./flattenDependencyTree";

export const getInstallationPathByDependencyPath = (
  targetPath: PackageIdentifier[],
  flatIndex: FlatDependencyIndex,
): string | null => {
  const targetName = targetPath[targetPath.length - 1].name;

  for (const [, entry] of Object.entries(flatIndex)) {
    if (
      entry.packageName === targetName &&
      entry.dependencyPath.length === targetPath.length
    ) {
      const matches = targetPath.every(
        ({ name, version }, index) =>
          entry.dependencyPath[index]?.name === name &&
          entry.dependencyPath[index]?.version === version,
      );

      if (matches) {
        return entry.installationPath;
      }
    }
  }

  return null;
};
