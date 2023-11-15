import { describe, expect, it } from "vitest";
import { getInstallationPath } from "../getInstallationPath";

describe("getInstallationPath", () => {
  it("should return a non-nested installation path when no available path is found", () => {
    expect(
      getInstallationPath({
        packageName: "package-a",
        version: "1.0.0",
        dependencyPath: [],
        nestedDependencyPaths: {
          "package-b@2.0.0": [[{ name: "package-a", version: "1.0.0" }]],
        },
      })
    ).toBe("node_modules/package-a");
  });

  it("should return a nested installation path when an available path is found", () => {
    expect(
      getInstallationPath({
        packageName: "package-b",
        version: "2.0.0",
        dependencyPath: [{ name: "package-a", version: "1.0.0" }],
        nestedDependencyPaths: {
          "package-b@2.0.0": [[{ name: "package-a", version: "1.0.0" }]],
        },
      })
    ).toBe("node_modules/package-a/node_modules/package-b");
  });

  it("should handle deeply nested installation paths", () => {
    expect(
      getInstallationPath({
        packageName: "package-d",
        version: "4.0.0",
        dependencyPath: [
          { name: "package-a", version: "1.0.0" },
          { name: "package-b", version: "2.0.0" },
          { name: "package-c", version: "3.0.0" },
        ],
        nestedDependencyPaths: {
          "package-d@4.0.0": [
            [
              { name: "package-a", version: "1.0.0" },
              { name: "package-b", version: "2.0.0" },
              { name: "package-c", version: "3.0.0" },
            ],
          ],
        },
      })
    ).toBe(
      "node_modules/package-a/node_modules/package-b/node_modules/package-c/node_modules/package-d"
    );
  });

  it("should infer the correct nested installation path when multiple available paths exist", () => {
    expect(
      getInstallationPath({
        packageName: "package-d",
        version: "4.0.0",
        dependencyPath: [
          { name: "package-a", version: "1.0.0" },
          { name: "package-b", version: "2.0.0" },
          { name: "package-c", version: "3.0.0" },
        ],
        nestedDependencyPaths: {
          "package-d@4.0.0": [
            [{ name: "package-a", version: "1.0.0" }],
            [
              { name: "package-a", version: "1.0.0" },
              { name: "package-b", version: "2.0.0" },
            ],
            [
              { name: "package-a", version: "1.0.0" },
              { name: "package-c", version: "3.0.0" },
            ],
          ],
        },
      })
    ).toBe(
      "node_modules/package-a/node_modules/package-c/node_modules/package-d"
    );
  });
});
