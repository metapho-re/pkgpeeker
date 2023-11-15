import { NestedDependencyPaths, PackageIdentifier } from "../types";

interface Props {
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
}: Props): string => {
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
                packageIdentifier.version === currentValue.version
            ),
          0
        );

        return { nestedDependencyPath, matchingScore };
      })
      .sort(
        (
          { matchingScore: matchingScoreA },
          { matchingScore: matchingScoreB }
        ) => matchingScoreB - matchingScoreA
      )[0];

  const parentsInstallationPath = parentsDependencyPath
    .map(({ name }) => name)
    .join("/node_modules/");

  return `node_modules/${parentsInstallationPath}/node_modules/${packageName}`;
};
