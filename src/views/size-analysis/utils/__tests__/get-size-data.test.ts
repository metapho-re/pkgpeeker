import { describe, expect, it } from "vitest";

import { getSizeData } from "../get-size-data";

import { makePackage } from "./helpers";

describe("getSizeData", () => {
  it("should return empty rows and null chain for empty tree", () => {
    expect(getSizeData({ dependencyTree: {}, maxDepth: 0 })).toEqual({
      rows: [],
      deepestDependencyChain: null,
      mostDependedOnPackage: null,
    });
  });

  it("should skip packages without folderStatistics", () => {
    const { rows } = getSizeData({
      dependencyTree: {
        a: makePackage({ folderStatistics: null }),
      },
      maxDepth: 1,
    });

    expect(rows).toEqual([]);
  });

  it("should map packages to rows", () => {
    const { rows } = getSizeData({
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
    const { rows } = getSizeData({
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

  it("should return the deepest package's dependency path", () => {
    const { deepestDependencyChain } = getSizeData({
      dependencyTree: {
        root: makePackage({
          depth: 0,
          dependencyPath: [{ name: "root", version: "1.0.0" }],
          dependencies: {
            mid: makePackage({
              depth: 1,
              dependencyPath: [
                { name: "root", version: "1.0.0" },
                { name: "mid", version: "1.0.0" },
              ],
              dependencies: {
                leaf: makePackage({
                  depth: 2,
                  dependencyPath: [
                    { name: "root", version: "1.0.0" },
                    { name: "mid", version: "1.0.0" },
                    { name: "leaf", version: "1.0.0" },
                  ],
                }),
              },
            }),
          },
        }),
      },
      maxDepth: 2,
    });

    expect(deepestDependencyChain).toEqual([
      { name: "root", version: "1.0.0" },
      { name: "mid", version: "1.0.0" },
      { name: "leaf", version: "1.0.0" },
    ]);
  });

  it("should skip deduped packages when picking the deepest tip", () => {
    const { deepestDependencyChain } = getSizeData({
      dependencyTree: {
        nested: makePackage({
          depth: 0,
          dependencyPath: [{ name: "nested", version: "1.0.0" }],
          dependencies: {
            physical: makePackage({
              depth: 1,
              dependencyPath: [
                { name: "nested", version: "1.0.0" },
                { name: "physical", version: "1.0.0" },
              ],
              dependencies: {
                hoisted: makePackage({
                  depth: 2,
                  isDeduped: true,
                  dependencyPath: [
                    { name: "nested", version: "1.0.0" },
                    { name: "physical", version: "1.0.0" },
                    { name: "hoisted", version: "1.0.0" },
                  ],
                }),
              },
            }),
          },
        }),
      },
      maxDepth: 2,
    });

    expect(deepestDependencyChain).toEqual([
      { name: "nested", version: "1.0.0" },
      { name: "physical", version: "1.0.0" },
    ]);
  });

  it("should return null mostDependedOnPackage when no package has dependencies", () => {
    const { mostDependedOnPackage } = getSizeData({
      dependencyTree: {
        a: makePackage({ depth: 0 }),
        b: makePackage({ depth: 0, installationPath: "/node_modules/b" }),
      },
      maxDepth: 0,
    });

    expect(mostDependedOnPackage).toBeNull();
  });

  it("should identify the most depended-on package", () => {
    const { mostDependedOnPackage } = getSizeData({
      dependencyTree: {
        a: makePackage({
          depth: 0,
          installationPath: "/node_modules/a",
          dependencyPath: [{ name: "a", version: "1.0.0" }],
          dependencies: {
            shared: makePackage({
              depth: 1,
              installationPath: "/node_modules/shared",
              dependencyPath: [
                { name: "a", version: "1.0.0" },
                { name: "shared", version: "1.0.0" },
              ],
            }),
          },
        }),
        b: makePackage({
          depth: 0,
          installationPath: "/node_modules/b",
          dependencyPath: [{ name: "b", version: "1.0.0" }],
          dependencies: {
            shared: makePackage({
              depth: 1,
              installationPath: "/node_modules/shared",
              isDeduped: true,
              dependencyPath: [
                { name: "b", version: "1.0.0" },
                { name: "shared", version: "1.0.0" },
              ],
            }),
            unique: makePackage({
              depth: 1,
              installationPath: "/node_modules/unique",
              dependencyPath: [
                { name: "b", version: "1.0.0" },
                { name: "unique", version: "1.0.0" },
              ],
            }),
          },
        }),
      },
      maxDepth: 1,
    });

    expect(mostDependedOnPackage).toEqual({
      name: "shared",
      dependentCount: 2,
    });
  });

  it("should skip deduped packages when counting dependents", () => {
    const { mostDependedOnPackage } = getSizeData({
      dependencyTree: {
        a: makePackage({
          depth: 0,
          installationPath: "/node_modules/a",
          dependencyPath: [{ name: "a", version: "1.0.0" }],
          dependencies: {
            lib: makePackage({
              depth: 1,
              installationPath: "/node_modules/lib",
              dependencyPath: [
                { name: "a", version: "1.0.0" },
                { name: "lib", version: "1.0.0" },
              ],
            }),
          },
        }),
        b: makePackage({
          depth: 0,
          installationPath: "/node_modules/b",
          isDeduped: true,
          dependencyPath: [{ name: "b", version: "1.0.0" }],
          dependencies: {
            lib: makePackage({
              depth: 1,
              installationPath: "/node_modules/lib",
              isDeduped: true,
              dependencyPath: [
                { name: "b", version: "1.0.0" },
                { name: "lib", version: "1.0.0" },
              ],
            }),
          },
        }),
      },
      maxDepth: 1,
    });

    expect(mostDependedOnPackage).toEqual({ name: "lib", dependentCount: 1 });
  });
});
