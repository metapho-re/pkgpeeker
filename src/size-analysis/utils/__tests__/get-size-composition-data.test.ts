import { describe, expect, it } from "vitest";

import { getSizeCompositionData } from "../get-size-composition-data";

import { makePackage, makeRow } from "./helpers";

describe("getSizeCompositionData", () => {
  it("should return zeroes for empty rows", () => {
    const result = getSizeCompositionData([]);

    expect(result.totalSize).toBe(0);
    expect(result.maxSize).toBe(0);
    expect(result.totalFileCount).toBe(0);
    expect(result.packageSizeEntries).toEqual([]);
    expect(result.extensionSizeEntries).toEqual({});
    expect(result.largestFileDetails).toBeNull();
  });

  it("should compute totals across rows", () => {
    const rows = [
      makeRow("alpha", { size: 300, fileCount: 10 }),
      makeRow("beta", { size: 200, fileCount: 5 }),
    ];
    const result = getSizeCompositionData(rows);

    expect(result.totalSize).toBe(500);
    expect(result.maxSize).toBe(300);
    expect(result.totalFileCount).toBe(15);
  });

  it("should produce distinct entries for same package with different versions", () => {
    const rows = [
      makeRow("lodash", {
        packageInformation: {
          packageName: "lodash",
          ...makePackage({ version: "4.17.21" }),
        },
        installationPath: "/node_modules/lodash",
        size: 500,
      }),
      makeRow("lodash", {
        packageInformation: {
          packageName: "lodash",
          ...makePackage({ version: "3.10.1" }),
        },
        installationPath: "/node_modules/foo/node_modules/lodash",
        size: 450,
      }),
    ];
    const result = getSizeCompositionData(rows);

    expect(result.packageSizeEntries).toEqual([
      ["lodash@4.17.21", 500],
      ["lodash@3.10.1", 450],
    ]);
  });

  it("should sort package size entries descending by size", () => {
    const rows = [
      makeRow("small", { size: 50 }),
      makeRow("large", { size: 500 }),
      makeRow("medium", { size: 200 }),
    ];
    const result = getSizeCompositionData(rows);

    expect(result.packageSizeEntries.map(([, size]) => size)).toEqual([
      500, 200, 50,
    ]);
  });

  it("should find the largest file across all rows", () => {
    const rows = [
      makeRow("alpha", {
        installationPath: "/node_modules/alpha",
        largestFileDetails: {
          filePath: "/node_modules/alpha/dist/index.js",
          sizeInBytes: 1000,
        },
      }),
      makeRow("beta", {
        installationPath: "/node_modules/beta",
        largestFileDetails: {
          filePath: "/node_modules/beta/lib/main.js",
          sizeInBytes: 2000,
        },
      }),
    ];
    const result = getSizeCompositionData(rows);

    expect(result.largestFileDetails).toEqual({
      packageName: "beta",
      filePath: "lib/main.js",
      sizeInBytes: 2000,
    });
  });

  it("should strip the installation path prefix from the largest file path", () => {
    const rows = [
      makeRow("pkg", {
        installationPath: "/node_modules/pkg",
        largestFileDetails: {
          filePath: "/node_modules/pkg/src/deep/file.ts",
          sizeInBytes: 500,
        },
      }),
    ];
    const result = getSizeCompositionData(rows);

    expect(result.largestFileDetails!.filePath).toBe("src/deep/file.ts");
  });

  it("should aggregate extension sizes across rows", () => {
    const rows = [
      makeRow("alpha", {
        packageInformation: {
          packageName: "alpha",
          ...makePackage({
            folderStatistics: {
              folderSizeInBytes: 300,
              numberOfFilesInFolder: 3,
              ".js": 200,
              ".css": 100,
            },
          }),
        },
        size: 300,
      }),
      makeRow("beta", {
        packageInformation: {
          packageName: "beta",
          ...makePackage({
            folderStatistics: {
              folderSizeInBytes: 150,
              numberOfFilesInFolder: 2,
              ".js": 100,
              ".ts": 50,
            },
          }),
        },
        size: 150,
      }),
    ];
    const result = getSizeCompositionData(rows);

    expect(result.extensionSizeEntries).toEqual({
      ".js": 300,
      ".css": 100,
      ".ts": 50,
    });
  });
});
