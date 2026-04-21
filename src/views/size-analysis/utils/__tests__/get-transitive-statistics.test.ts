import { describe, expect, it } from "vitest";

import type { DependencyTree } from "../../../../types";

import { getTransitiveStatistics } from "../get-transitive-statistics";

import { makePackage } from "./helpers";

describe("getTransitiveStatistics", () => {
  it("should return zeroes for empty dependencies", () => {
    expect(getTransitiveStatistics({})).toEqual({
      uniqueDependencyCount: 0,
      totalSize: 0,
    });
  });

  it("should count flat dependencies and sum their sizes", () => {
    const tree: DependencyTree = {
      a: makePackage({ installationPath: "/node_modules/a", sizeInBytes: 100 }),
      b: makePackage({ installationPath: "/node_modules/b", sizeInBytes: 200 }),
    };

    expect(getTransitiveStatistics(tree)).toEqual({
      uniqueDependencyCount: 2,
      totalSize: 300,
    });
  });

  it("should count nested dependencies", () => {
    const tree: DependencyTree = {
      a: makePackage({
        installationPath: "/node_modules/a",
        sizeInBytes: 100,
        dependencies: {
          b: makePackage({
            installationPath: "/node_modules/b",
            sizeInBytes: 50,
            dependencies: {
              c: makePackage({
                installationPath: "/node_modules/c",
                sizeInBytes: 25,
              }),
            },
          }),
        },
      }),
    };

    expect(getTransitiveStatistics(tree)).toEqual({
      uniqueDependencyCount: 3,
      totalSize: 175,
    });
  });

  it("should deduplicate both count and size by installation path", () => {
    const tree: DependencyTree = {
      a: makePackage({
        installationPath: "/node_modules/a",
        sizeInBytes: 100,
        dependencies: {
          shared: makePackage({
            installationPath: "/node_modules/shared",
            sizeInBytes: 50,
          }),
        },
      }),
      b: makePackage({
        installationPath: "/node_modules/b",
        sizeInBytes: 100,
        dependencies: {
          shared: makePackage({
            installationPath: "/node_modules/shared",
            sizeInBytes: 50,
          }),
        },
      }),
    };

    expect(getTransitiveStatistics(tree)).toEqual({
      uniqueDependencyCount: 3,
      totalSize: 250,
    });
  });
});
