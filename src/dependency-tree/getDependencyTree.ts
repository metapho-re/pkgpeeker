import { WebContainer } from "@webcontainer/api";
import { getFolderComposition, getFolderStatistics } from "../folder-analytics";
import { getPackageMetadata } from "../package-json-parser";
import { DependencyTree, NpmDependencyTree, PackageDataIndex } from "../types";

interface Props {
  webContainerInstance: WebContainer | undefined;
  npmDependencyTree: NpmDependencyTree;
  nestedDependencyPaths: Record<string, string>;
  packageDataIndex: PackageDataIndex;
  maxDepth: { value: number };
  depth: number;
  dependencyPath: string[];
}

export const getDependencyTree = async ({
  webContainerInstance,
  npmDependencyTree,
  nestedDependencyPaths,
  packageDataIndex,
  maxDepth,
  depth,
  dependencyPath,
}: Props): Promise<DependencyTree> =>
  await Object.entries(npmDependencyTree).reduce(
    async (
      dependencyTreePromise: Promise<DependencyTree>,
      [packageName, npmPackageInformation]
    ): Promise<DependencyTree> => {
      const dependencyTree = await dependencyTreePromise;

      const version = npmPackageInformation.version;

      if (!version) {
        return dependencyTree;
      }

      const isDeduped = !(npmPackageInformation.overridden === false);
      const isExtraneous = npmPackageInformation.extraneous === true;
      const invalidityDetails = npmPackageInformation.invalid || null;

      const installationPath =
        nestedDependencyPaths[`${packageName}@${version}`] ??
        `node_modules/${packageName}`;

      const alreadyCrunchedPackageData = packageDataIndex[installationPath];

      const folderStatistics =
        alreadyCrunchedPackageData?.folderStatistics ||
        getFolderStatistics(
          await getFolderComposition({ webContainerInstance, installationPath })
        );

      const packageMetadata =
        alreadyCrunchedPackageData?.packageMetadata ||
        (await getPackageMetadata({
          webContainerInstance,
          installationPath,
        }));

      if (!alreadyCrunchedPackageData) {
        packageDataIndex[installationPath] = {
          folderStatistics,
          packageMetadata,
        };
      }

      if (depth > maxDepth.value) {
        maxDepth.value = depth;
      }

      const nextDependencyPath = [...dependencyPath, packageName];

      const dependencies = npmDependencyTree[packageName].dependencies
        ? await getDependencyTree({
            webContainerInstance,
            npmDependencyTree: npmDependencyTree[packageName]
              .dependencies as NpmDependencyTree,
            nestedDependencyPaths,
            packageDataIndex,
            maxDepth,
            depth: depth + 1,
            dependencyPath: nextDependencyPath,
          })
        : {};

      return {
        ...dependencyTree,
        [packageName]: {
          depth,
          isDeduped,
          isExtraneous,
          invalidityDetails,
          version,
          installationPath,
          dependencyPath: nextDependencyPath,
          folderStatistics,
          packageMetadata,
          dependencies,
        },
      };
    },
    Promise.resolve({})
  );
