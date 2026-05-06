import type { PackageInformation } from "../../types";

export const makePackage = (
  overrides: Partial<PackageInformation> = {},
): PackageInformation => ({
  depth: 1,
  isDeduped: false,
  isExtraneous: false,
  invalidityDetails: null,
  version: "1.0.0",
  installationPath: "/node_modules/pkg",
  dependencyPath: [],
  folderStatistics: {
    folderSizeInBytes: 100,
    numberOfFilesInFolder: 5,
  },
  packageMetadata: null,
  dependencies: {},
  ...overrides,
});
