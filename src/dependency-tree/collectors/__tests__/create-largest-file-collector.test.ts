import { describe, expect, it } from "vitest";

import { createLargestFileCollector } from "../create-largest-file-collector";

import { makePackage } from "./helpers";

describe("createLargestFileCollector", () => {
  it("should return null for empty tree", () => {
    const collector = createLargestFileCollector();

    expect(collector.getResult()).toBeNull();
  });

  it("should return null when no package has a largest file", () => {
    const collector = createLargestFileCollector();

    collector.collect({
      largestFile: null,
      packageName: "a",
      packageInformation: makePackage(),
    });

    expect(collector.getResult()).toBeNull();
  });

  it("should return the largest file from a single package", () => {
    const collector = createLargestFileCollector();

    collector.collect({
      packageName: "a",
      packageInformation: makePackage({
        installationPath: "/node_modules/a",
      }),
      largestFile: {
        filePath: "/node_modules/a/dist/bundle.js",
        sizeInBytes: 500,
      },
    });

    expect(collector.getResult()).toEqual({
      packageName: "a",
      filePath: "dist/bundle.js",
      sizeInBytes: 500,
    });
  });

  it("should track the largest file across multiple packages", () => {
    const collector = createLargestFileCollector();

    collector.collect({
      packageName: "small",
      packageInformation: makePackage({
        installationPath: "/node_modules/small",
      }),
      largestFile: {
        filePath: "/node_modules/small/index.js",
        sizeInBytes: 100,
      },
    });

    collector.collect({
      packageName: "big",
      packageInformation: makePackage({
        installationPath: "/node_modules/big",
      }),
      largestFile: {
        filePath: "/node_modules/big/dist/main.js",
        sizeInBytes: 9000,
      },
    });

    collector.collect({
      packageName: "medium",
      packageInformation: makePackage({
        installationPath: "/node_modules/medium",
      }),
      largestFile: {
        filePath: "/node_modules/medium/lib/util.js",
        sizeInBytes: 300,
      },
    });

    expect(collector.getResult()).toEqual({
      packageName: "big",
      filePath: "dist/main.js",
      sizeInBytes: 9000,
    });
  });

  it("should skip packages without a largest file", () => {
    const collector = createLargestFileCollector();

    collector.collect({
      largestFile: null,
      packageName: "no-file",
      packageInformation: makePackage(),
    });

    collector.collect({
      packageName: "has-file",
      packageInformation: makePackage({
        installationPath: "/node_modules/has-file",
      }),
      largestFile: {
        filePath: "/node_modules/has-file/index.js",
        sizeInBytes: 50,
      },
    });

    expect(collector.getResult()).toEqual({
      packageName: "has-file",
      filePath: "index.js",
      sizeInBytes: 50,
    });
  });

  it("should strip the installation path prefix from file path", () => {
    const collector = createLargestFileCollector();

    collector.collect({
      packageName: "nested",
      packageInformation: makePackage({
        installationPath: "/node_modules/parent/node_modules/nested",
      }),
      largestFile: {
        filePath: "/node_modules/parent/node_modules/nested/src/deep/file.js",
        sizeInBytes: 200,
      },
    });

    expect(collector.getResult()).toEqual({
      packageName: "nested",
      filePath: "src/deep/file.js",
      sizeInBytes: 200,
    });
  });
});
