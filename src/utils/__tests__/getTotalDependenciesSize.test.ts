import { describe, expect, it } from "vitest";
import { DependencyTree } from "../../types";
import { getTotalDependenciesSize } from "../getTotalDependenciesSize";

const makePackage = (
  sizeInBytes: number,
  dependencies: DependencyTree = {},
) => ({
  depth: 1,
  isDeduped: false,
  isExtraneous: false,
  invalidityDetails: null,
  version: "1.0.0",
  installationPath: `/node_modules/pkg`,
  dependencyPath: [],
  folderStatistics: {
    folderSizeInBytes: sizeInBytes,
    numberOfFilesInFolder: 1,
  },
  packageMetadata: null,
  dependencies,
});

describe("getTotalDependenciesSize", () => {
  it("should return 0 for empty dependencies", () => {
    expect(getTotalDependenciesSize({})).toBe(0);
  });

  it("should sum sizes of flat dependencies", () => {
    const tree: DependencyTree = {
      a: makePackage(100),
      b: makePackage(200),
    };
    expect(getTotalDependenciesSize(tree)).toBe(300);
  });

  it("should sum sizes of nested dependencies", () => {
    const tree: DependencyTree = {
      a: makePackage(100, {
        b: makePackage(50, {
          c: makePackage(25),
        }),
      }),
    };
    expect(getTotalDependenciesSize(tree)).toBe(175);
  });

  it("should handle packages with null folderStatistics", () => {
    const tree: DependencyTree = {
      a: {
        ...makePackage(0),
        folderStatistics: null,
      },
      b: makePackage(200),
    };
    expect(getTotalDependenciesSize(tree)).toBe(200);
  });
});
