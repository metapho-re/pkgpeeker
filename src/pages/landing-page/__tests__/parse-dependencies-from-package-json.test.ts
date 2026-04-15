import { describe, expect, it } from "vitest";

import { parseDependenciesFromPackageJson } from "../parse-dependencies-from-package-json";

describe("parseDependenciesFromPackageJson", () => {
  it("should return package names with their versions", () => {
    const content = JSON.stringify({
      dependencies: {
        react: "^18.2.0",
        lodash: "~4.17.21",
      },
    });

    expect(parseDependenciesFromPackageJson(content)).toEqual([
      "react@^18.2.0",
      "lodash@~4.17.21",
    ]);
  });

  it("should return an exact version", () => {
    const content = JSON.stringify({
      dependencies: { typescript: "5.3.2" },
    });

    expect(parseDependenciesFromPackageJson(content)).toEqual([
      "typescript@5.3.2",
    ]);
  });

  it("should ignore devDependencies", () => {
    const content = JSON.stringify({
      dependencies: { react: "^18.2.0" },
      devDependencies: { vitest: "^1.0.0" },
    });

    expect(parseDependenciesFromPackageJson(content)).toEqual([
      "react@^18.2.0",
    ]);
  });

  it("should return an empty array when dependencies is missing", () => {
    const content = JSON.stringify({
      devDependencies: { vitest: "^1.0.0" },
    });

    expect(parseDependenciesFromPackageJson(content)).toEqual([]);
  });

  it("should return an empty array when dependencies is empty", () => {
    const content = JSON.stringify({ dependencies: {} });

    expect(parseDependenciesFromPackageJson(content)).toEqual([]);
  });

  it("should throw on invalid JSON", () => {
    expect(() => parseDependenciesFromPackageJson("not JSON")).toThrow();
  });
});
