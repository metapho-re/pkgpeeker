import { describe, expect, it } from "vitest";

import { createReverseDependencyCollector } from "../create-reverse-dependency-collector";

import { makePackage } from "./helpers";

describe("createReverseDependencyCollector", () => {
  it("should return an empty object and null when no package has dependencies", () => {
    const collector = createReverseDependencyCollector();

    collector.collect({
      largestFile: null,
      packageName: "a",
      packageInformation: makePackage(),
    });

    expect(collector.getResult()).toEqual({
      dependents: {},
      mostDependedOnPackage: null,
    });
  });

  it("should return sorted dependent package names", () => {
    const collector = createReverseDependencyCollector();

    collector.collect({
      largestFile: null,
      packageName: "zeta",
      packageInformation: makePackage({
        dependencies: { lib: makePackage() },
      }),
    });

    collector.collect({
      largestFile: null,
      packageName: "alpha",
      packageInformation: makePackage({
        dependencies: { lib: makePackage() },
      }),
    });

    expect(collector.getResult().dependents["lib"]).toEqual(["alpha", "zeta"]);
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
      dependents: { shared: ["a", "b"], unique: ["b"] },
      mostDependedOnPackage: { name: "shared", dependentCount: 2 },
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

    expect(collector.getResult()).toEqual({
      dependents: { lib: ["a"] },
      mostDependedOnPackage: { name: "lib", dependentCount: 1 },
    });
  });
});
