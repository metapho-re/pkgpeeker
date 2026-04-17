import { describe, expect, it } from "vitest";

import type { DependencyTree, PackageInformation } from "../../../types";

import {
  getRows,
  getSortedRows,
  getUniqueTransitiveDependenciesCount,
  type Row,
} from "../utils";

const makePackage = (
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
  packageMetadata: null,
  dependencies: {},
  ...overrides,
});

const makeRow = (name: string, overrides: Partial<Row> = {}): Row => ({
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
  ...overrides,
});

describe("getUniqueTransitiveDependenciesCount", () => {
  it("should return 0 for empty dependencies", () => {
    expect(getUniqueTransitiveDependenciesCount({})).toBe(0);
  });

  it("should count flat dependencies", () => {
    const tree: DependencyTree = {
      a: makePackage({ installationPath: "/node_modules/a" }),
      b: makePackage({ installationPath: "/node_modules/b" }),
    };
    expect(getUniqueTransitiveDependenciesCount(tree)).toBe(2);
  });

  it("should count nested dependencies", () => {
    const tree: DependencyTree = {
      a: makePackage({
        installationPath: "/node_modules/a",
        dependencies: {
          b: makePackage({
            installationPath: "/node_modules/b",
            dependencies: {
              c: makePackage({ installationPath: "/node_modules/c" }),
            },
          }),
        },
      }),
    };
    expect(getUniqueTransitiveDependenciesCount(tree)).toBe(3);
  });

  it("should deduplicate by installation path", () => {
    const tree: DependencyTree = {
      a: makePackage({
        installationPath: "/node_modules/a",
        dependencies: {
          shared: makePackage({ installationPath: "/node_modules/shared" }),
        },
      }),
      b: makePackage({
        installationPath: "/node_modules/b",
        dependencies: {
          shared: makePackage({ installationPath: "/node_modules/shared" }),
        },
      }),
    };
    expect(getUniqueTransitiveDependenciesCount(tree)).toBe(3);
  });
});

describe("getRows", () => {
  it("should return empty array for empty tree", () => {
    expect(getRows({ dependencyTree: {}, maxDepth: 0 })).toEqual([]);
  });

  it("should skip packages without folderStatistics", () => {
    const rows = getRows({
      dependencyTree: {
        a: makePackage({ folderStatistics: null }),
      },
      maxDepth: 1,
    });
    expect(rows).toEqual([]);
  });

  it("should map packages to rows", () => {
    const rows = getRows({
      dependencyTree: {
        a: makePackage({
          installationPath: "/node_modules/a",
          version: "2.0.0",
          depth: 0,
        }),
      },
      maxDepth: 1,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].installationPath).toBe("/node_modules/a");
    expect(rows[0].size).toBe(100);
    expect(rows[0].fileCount).toBe(5);
    expect(rows[0].depth).toBe(0);
    expect(rows[0].packageInformation.version).toBe("2.0.0");
  });

  it("should prefer non-deduped over deduped entries for the same path", () => {
    const rows = getRows({
      dependencyTree: {
        a: makePackage({
          installationPath: "/node_modules/a",
          isDeduped: true,
          version: "1.0.0",
        }),
        b: makePackage({
          installationPath: "/node_modules/a",
          isDeduped: false,
          version: "1.0.0",
        }),
      },
      maxDepth: 1,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0].packageInformation.isDeduped).toBe(false);
  });
});

describe("getSortedRows", () => {
  const rowA = makeRow("alpha", { size: 300, depth: 1 });
  const rowB = makeRow("beta", { size: 100, depth: 3 });
  const rowC = makeRow("gamma", { size: 200, depth: 2 });

  it("should sort by size descending", () => {
    const sorted = getSortedRows({
      rows: [rowA, rowB, rowC],
      sortKey: "size",
      sortDirection: "desc",
    });
    expect(sorted.map(({ size }) => size)).toEqual([300, 200, 100]);
  });

  it("should sort by size ascending", () => {
    const sorted = getSortedRows({
      rows: [rowA, rowB, rowC],
      sortKey: "size",
      sortDirection: "asc",
    });
    expect(sorted.map(({ size }) => size)).toEqual([100, 200, 300]);
  });

  it("should sort by name ascending", () => {
    const sorted = getSortedRows({
      rows: [rowC, rowA, rowB],
      sortKey: "name",
      sortDirection: "asc",
    });
    expect(
      sorted.map(({ packageInformation }) => packageInformation.packageName),
    ).toEqual(["alpha", "beta", "gamma"]);
  });

  it("should sort by depth descending", () => {
    const sorted = getSortedRows({
      rows: [rowA, rowB, rowC],
      sortKey: "depth",
      sortDirection: "desc",
    });
    expect(sorted.map(({ depth }) => depth)).toEqual([3, 2, 1]);
  });

  it("should break ties by name", () => {
    const row1 = makeRow("zeta", { size: 100 });
    const row2 = makeRow("alpha", { size: 100 });

    const descSorted = getSortedRows({
      rows: [row1, row2],
      sortKey: "size",
      sortDirection: "desc",
    });
    expect(
      descSorted.map(
        ({ packageInformation }) => packageInformation.packageName,
      ),
    ).toEqual(["zeta", "alpha"]);

    const ascSorted = getSortedRows({
      rows: [row1, row2],
      sortKey: "size",
      sortDirection: "asc",
    });
    expect(
      ascSorted.map(({ packageInformation }) => packageInformation.packageName),
    ).toEqual(["alpha", "zeta"]);
  });

  it("should not mutate the input array", () => {
    const rows = [rowC, rowA, rowB];
    getSortedRows({ rows, sortKey: "size", sortDirection: "asc" });
    expect(rows[0]).toBe(rowC);
  });
});
