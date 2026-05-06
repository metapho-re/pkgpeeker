import { describe, expect, it } from "vitest";

import { createDeepestDependencyChainCollector } from "../create-deepest-dependency-chain-collector";

import { makePackage } from "./helpers";

describe("createDeepestDependencyChainCollector", () => {
  it("should return null for empty tree", () => {
    const collector = createDeepestDependencyChainCollector();

    expect(collector.getResult()).toBeNull();
  });

  it("should return null when only depth-0 packages exist", () => {
    const collector = createDeepestDependencyChainCollector();

    collector.collect({
      largestFile: null,
      packageName: "a",
      packageInformation: makePackage({
        dependencyPath: [{ name: "a", version: "1.0.0" }],
      }),
    });

    expect(collector.getResult()).toBeNull();
  });

  it("should return the deepest dependency path", () => {
    const collector = createDeepestDependencyChainCollector();

    collector.collect({
      largestFile: null,
      packageName: "root",
      packageInformation: makePackage({
        dependencyPath: [{ name: "root", version: "1.0.0" }],
      }),
    });

    collector.collect({
      largestFile: null,
      packageName: "mid",
      packageInformation: makePackage({
        dependencyPath: [
          { name: "root", version: "1.0.0" },
          { name: "mid", version: "1.0.0" },
        ],
      }),
    });

    collector.collect({
      largestFile: null,
      packageName: "leaf",
      packageInformation: makePackage({
        dependencyPath: [
          { name: "root", version: "1.0.0" },
          { name: "mid", version: "1.0.0" },
          { name: "leaf", version: "1.0.0" },
        ],
      }),
    });

    expect(collector.getResult()).toEqual([
      { name: "root", version: "1.0.0" },
      { name: "mid", version: "1.0.0" },
      { name: "leaf", version: "1.0.0" },
    ]);
  });

  it("should skip deduped packages", () => {
    const collector = createDeepestDependencyChainCollector();

    collector.collect({
      largestFile: null,
      packageName: "physical",
      packageInformation: makePackage({
        dependencyPath: [
          { name: "nested", version: "1.0.0" },
          { name: "physical", version: "1.0.0" },
        ],
      }),
    });

    collector.collect({
      largestFile: null,
      packageName: "hoisted",
      packageInformation: makePackage({
        isDeduped: true,
        dependencyPath: [
          { name: "nested", version: "1.0.0" },
          { name: "physical", version: "1.0.0" },
          { name: "hoisted", version: "1.0.0" },
        ],
      }),
    });

    expect(collector.getResult()).toEqual([
      { name: "nested", version: "1.0.0" },
      { name: "physical", version: "1.0.0" },
    ]);
  });
});
