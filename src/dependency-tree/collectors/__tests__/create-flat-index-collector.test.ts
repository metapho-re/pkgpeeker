import { describe, expect, it } from "vitest";

import { createFlatIndexCollector } from "../create-flat-index-collector";

import { makePackage } from "./helpers";

describe("createFlatIndexCollector", () => {
  it("should return an empty index for no collections", () => {
    const collector = createFlatIndexCollector();

    expect(collector.getResult()).toEqual({});
  });

  it("should index nodes by tree path", () => {
    const collector = createFlatIndexCollector();

    collector.collect({
      largestFile: null,
      packageName: "a",
      packageInformation: makePackage({
        dependencyPath: [{ name: "a", version: "1.0.0" }],
      }),
    });

    const result = collector.getResult();

    expect(Object.keys(result)).toEqual(["a@1.0.0"]);
    expect(result["a@1.0.0"].packageName).toBe("a");
  });

  it("should index nested nodes", () => {
    const collector = createFlatIndexCollector();

    collector.collect({
      largestFile: null,
      packageName: "a",
      packageInformation: makePackage({
        dependencyPath: [{ name: "a", version: "1.0.0" }],
      }),
    });

    collector.collect({
      largestFile: null,
      packageName: "b",
      packageInformation: makePackage({
        dependencyPath: [
          { name: "a", version: "1.0.0" },
          { name: "b", version: "2.0.0" },
        ],
      }),
    });

    const result = collector.getResult();

    expect(Object.keys(result)).toEqual(["a@1.0.0", "a@1.0.0/b@2.0.0"]);
  });
});
