import type { PackageInformation } from "../../../../types";

import type { Row } from "../types";

export const makePackage = (
  overrides: Partial<PackageInformation> & { sizeInBytes?: number } = {},
): PackageInformation => ({
  depth: 1,
  isDeduped: false,
  isExtraneous: false,
  invalidityDetails: null,
  version: "1.0.0",
  installationPath: "/node_modules/pkg",
  dependencyPath: [],
  folderStatistics: {
    folderSizeInBytes: overrides.sizeInBytes ?? 100,
    numberOfFilesInFolder: 5,
  },
  largestFileDetails: null,
  packageMetadata: null,
  dependencies: {},
  ...overrides,
});

export const makeRow = (name: string, overrides: Partial<Row> = {}): Row => ({
  packageInformation: {
    packageName: name,
    ...makePackage(),
  },
  installationPath: `/node_modules/${name}`,
  size: 100,
  fileCount: 5,
  directDependencyCount: 0,
  transitiveDependencyCount: 0,
  dependenciesSize: 0,
  depth: 1,
  largestFileDetails: null,
  ...overrides,
});
