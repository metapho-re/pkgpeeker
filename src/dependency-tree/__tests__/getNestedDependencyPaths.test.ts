import { describe, expect, it } from "vitest";
import { getNestedDependencyPaths } from "../getNestedDependencyPaths";

const mockedWebContainerInstance = {
  fs: {
    readFile: async () =>
      Promise.resolve(`{
        "packages": {
          "": {
            "dependencies": "package"
          },
          "node_modules/package-a": {
            "version": "1.0.0"
          },
          "node_modules/package-a/node_modules/package-b": {
            "version": "2.0.0"
          },
          "node_modules/package-a/node_modules/package-b/node_modules/package-c": {
            "version": "3.0.0"
          },
          "node_modules/package-a/node_modules/package-b/node_modules/package-d": {
            "version": "5.0.0"
          },
          "node_modules/package-d": {
            "version": "4.0.0"
          },
          "node_modules/package-d/node_modules/package-c": {
            "version": "3.0.0"
          },
          "node_modules/package-d/node_modules/package-b": {
            "version": "2.0.0"
          }
        }
      }`),
  },
};

describe("getNestedDependencyPaths", () => {
  it("should return an object defining, as arrays and sorted by child package, all nested dependencies in package-lock.json", async () => {
    // @ts-expect-error test
    expect(await getNestedDependencyPaths(mockedWebContainerInstance)).toEqual({
      "package-b@2.0.0": [
        [{ name: "package-a", version: "1.0.0" }],
        [{ name: "package-d", version: "4.0.0" }],
      ],
      "package-c@3.0.0": [
        [
          { name: "package-a", version: "1.0.0" },
          { name: "package-b", version: "2.0.0" },
        ],
        [{ name: "package-d", version: "4.0.0" }],
      ],
      "package-d@5.0.0": [
        [
          { name: "package-a", version: "1.0.0" },
          { name: "package-b", version: "2.0.0" },
        ],
      ],
    });
  });
});
