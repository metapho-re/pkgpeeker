import { describe, expect, it } from "vitest";

import { createReverseDependencyCollector } from "../create-reverse-dependency-collector";

import { makePackage } from "./helpers";

describe("createReverseDependencyCollector", () => {
  it("should return null when no package has dependencies", () => {
    const collector = createReverseDependencyCollector();

    collector.collect({
      largestFile: null,
      packageName: "a",
      packageInformation: makePackage(),
    });

    expect(collector.getResult()).toBeNull();
  });

  it("should identify the most depended-on package", () => {
    const collector = createReverseDependencyCollector();

    collector.collect({
      largestFile: null,
      packageName: "a",
      packageInformation: makePackage({
        dependencies: {
          shared: makePackage(),
        },
      }),
    });

    collector.collect({
      largestFile: null,
      packageName: "b",
      packageInformation: makePackage({
        dependencies: {
          shared: makePackage(),
          unique: makePackage(),
        },
      }),
    });

    expect(collector.getResult()).toEqual({
      name: "shared",
      dependentCount: 2,
    });
  });

  it("should skip deduped packages when counting dependents", () => {
    const collector = createReverseDependencyCollector();

    collector.collect({
      largestFile: null,
      packageName: "a",
      packageInformation: makePackage({
        dependencies: {
          lib: makePackage(),
        },
      }),
    });

    collector.collect({
      largestFile: null,
      packageName: "b",
      packageInformation: makePackage({
        isDeduped: true,
        dependencies: {
          lib: makePackage(),
        },
      }),
    });

    expect(collector.getResult()).toEqual({ name: "lib", dependentCount: 1 });
  });
});
