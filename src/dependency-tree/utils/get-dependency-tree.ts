import type { WebContainer } from "@webcontainer/api";

import type { CollectorRunner } from "../collectors";
import { getFolderAnalysis, getFolderComposition } from "../folder-analytics";
import { getPackageMetadata } from "../package-json-parser";
import type {
  DependencyTree,
  NestedDependencyPaths,
  NpmDependencyTree,
  PackageDataIndex,
  PackageIdentifier,
} from "../types";

import { getInstallationPath } from "./get-installation-path";

interface Params {
  webContainerInstance: WebContainer | null;
  npmDependencyTree: NpmDependencyTree;
  collectorRunner: CollectorRunner;
  nestedDependencyPaths: NestedDependencyPaths;
  packageDataIndex: PackageDataIndex;
  maxDepth: { value: number };
  depth: number;
  dependencyPath: PackageIdentifier[];
}

export const getDependencyTree = async ({
  webContainerInstance,
  npmDependencyTree,
  collectorRunner,
  nestedDependencyPaths,
  packageDataIndex,
  maxDepth,
  depth,
  dependencyPath,
}: Params): Promise<DependencyTree> =>
  await Object.entries(npmDependencyTree).reduce(
    async (
      dependencyTreePromise: Promise<DependencyTree>,
      [packageName, npmPackageInformation],
    ): Promise<DependencyTree> => {
      const dependencyTree = await dependencyTreePromise;

      const version = npmPackageInformation.version;

      if (!version) {
        return dependencyTree;
      }

      const isDeduped = !(npmPackageInformation.overridden === false);
      const isExtraneous = npmPackageInformation.extraneous === true;
      const invalidityDetails = npmPackageInformation.invalid || null;

      const installationPath = getInstallationPath({
        packageName,
        version,
        dependencyPath,
        nestedDependencyPaths,
      });

      const alreadyCrunchedPackageData = packageDataIndex[installationPath];

      const { folderStatistics, largestFile } =
        alreadyCrunchedPackageData ||
        getFolderAnalysis(
          await getFolderComposition({
            webContainerInstance,
            installationPath,
          }),
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
          largestFile,
          packageMetadata,
        };
      }

      if (depth > maxDepth.value) {
        maxDepth.value = depth;
      }

      const nextDependencyPath = [
        ...dependencyPath,
        { name: packageName, version },
      ];

      const dependencies = npmDependencyTree[packageName].dependencies
        ? await getDependencyTree({
            webContainerInstance,
            npmDependencyTree: npmDependencyTree[packageName]
              .dependencies as NpmDependencyTree,
            collectorRunner,
            nestedDependencyPaths,
            packageDataIndex,
            maxDepth,
            depth: depth + 1,
            dependencyPath: nextDependencyPath,
          })
        : {};

      const packageInformation = {
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
      };

      collectorRunner.collect({ packageName, packageInformation, largestFile });

      return {
        ...dependencyTree,
        [packageName]: packageInformation,
      };
    },
    Promise.resolve({}),
  );
