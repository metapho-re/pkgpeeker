import type { NestedDependencyPaths, PackageIdentifier } from "../../types";

interface Params {
  packageName: string;
  version: string;
  dependencyPath: PackageIdentifier[];
  nestedDependencyPaths: NestedDependencyPaths;
}

export const getInstallationPath = ({
  packageName,
  version,
  dependencyPath,
  nestedDependencyPaths,
}: Params): string => {
  const availableNestedDependencyPaths =
    nestedDependencyPaths[`${packageName}@${version}`];

  if (!availableNestedDependencyPaths) {
    return `node_modules/${packageName}`;
  }

  const { nestedDependencyPath: parentsDependencyPath } =
    availableNestedDependencyPaths
      .map((nestedDependencyPath) => {
        const matchingScore = nestedDependencyPath.reduce(
          (previousValue, currentValue) =>
            previousValue +
            dependencyPath.findIndex(
              (packageIdentifier) =>
                packageIdentifier.name === currentValue.name &&
                packageIdentifier.version === currentValue.version,
            ),
          0,
        );

        return { nestedDependencyPath, matchingScore };
      })
      .sort((a, b) => {
        if (b.matchingScore !== a.matchingScore) {
          return b.matchingScore - a.matchingScore;
        }

        if (b.nestedDependencyPath.length !== a.nestedDependencyPath.length) {
          return b.nestedDependencyPath.length - a.nestedDependencyPath.length;
        }

        const pathA = a.nestedDependencyPath.map((p) => p.name).join("/");
        const pathB = b.nestedDependencyPath.map((p) => p.name).join("/");

        return pathA.localeCompare(pathB);
      })[0];

  const parentsInstallationPath = parentsDependencyPath
    .map(({ name }) => name)
    .join("/node_modules/");

  return `node_modules/${parentsInstallationPath}/node_modules/${packageName}`;
};
