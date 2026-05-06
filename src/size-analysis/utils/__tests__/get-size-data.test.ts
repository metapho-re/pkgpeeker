import { describe, expect, it } from "vitest";

import type {
  DependencyTree,
  DependencyTreeData,
  FlatDependencyIndex,
} from "../../../dependency-tree";
import { getTreePath } from "../../../shared";

import { getSizeData } from "../get-size-data";

import { makePackage } from "./helpers";

const flattenTree = (tree: DependencyTree): FlatDependencyIndex => {
  const index: FlatDependencyIndex = {};

  const walk = (subtree: DependencyTree) => {
    for (const [packageName, info] of Object.entries(subtree)) {
      index[getTreePath(info.dependencyPath)] = { packageName, ...info };
      walk(info.dependencies);
    }
  };

  walk(tree);

  return index;
};

const makeTreeData = (
  dependencyTree: DependencyTree,
  maxDepth = 0,
): DependencyTreeData => ({
  dependencyTree,
  maxDepth,
  flatIndex: flattenTree(dependencyTree),
  deepestDependencyChain: null,
  mostDependedOnPackage: null,
  largestFileMatch: null,
  dependents: {},
});

describe("getSizeData", () => {
  it("should return empty rows for empty tree", () => {
    expect(getSizeData(makeTreeData({}))).toEqual([]);
  });

  it("should skip packages without folderStatistics", () => {
    const rows = getSizeData(
      makeTreeData({
        a: makePackage({ folderStatistics: null }),
      }),
    );

    expect(rows).toEqual([]);
  });

  it("should map packages to rows", () => {
    const rows = getSizeData(
      makeTreeData({
        a: makePackage({
          installationPath: "/node_modules/a",
          version: "2.0.0",
          depth: 0,
        }),
      }),
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].installationPath).toBe("/node_modules/a");
    expect(rows[0].size).toBe(100);
    expect(rows[0].fileCount).toBe(5);
    expect(rows[0].depth).toBe(0);
    expect(rows[0].packageInformation.version).toBe("2.0.0");
  });

  it("should prefer non-deduped over deduped entries for the same path", () => {
    const rows = getSizeData(
      makeTreeData({
        a: makePackage({
          installationPath: "/node_modules/a",
          isDeduped: true,
          version: "1.0.0",
          dependencyPath: [{ name: "a", version: "1.0.0" }],
        }),
        b: makePackage({
          installationPath: "/node_modules/a",
          isDeduped: false,
          version: "1.0.0",
          dependencyPath: [{ name: "b", version: "1.0.0" }],
        }),
      }),
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].packageInformation.isDeduped).toBe(false);
  });
});
