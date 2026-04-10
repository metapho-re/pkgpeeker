import { describe, expect, it } from "vitest";

import { createLocation, getPackagesFromPath, parseLocation } from "../utils";

describe("createLocation", () => {
  it("should create a path with packages only when view is empty", () => {
    expect(createLocation("react,lodash")).toBe("/react,lodash");
  });

  it("should create a path with packages and view", () => {
    expect(createLocation("react,lodash", "files")).toBe("/react,lodash/files");
  });

  it("should create a root path when both packages and view are empty", () => {
    expect(createLocation("", "")).toBe("/");
  });
});

describe("getPackagesFromPath", () => {
  it("should return an empty string for the root path", () => {
    expect(getPackagesFromPath("/")).toBe("");
  });

  it("should return space-separated package names from a comma-separated path", () => {
    expect(getPackagesFromPath("/react,lodash")).toBe("react lodash");
  });

  it("should return a single package name", () => {
    expect(getPackagesFromPath("/react")).toBe("react");
  });

  it("should decode encoded package names", () => {
    expect(getPackagesFromPath("/%40scope%2Fpkg")).toBe("@scope/pkg");
  });

  it("should ignore the view segment", () => {
    expect(getPackagesFromPath("/react,lodash/files")).toBe("react lodash");
  });
});

describe("parseLocation", () => {
  it("should return an empty view and empty packages for the root path", () => {
    expect(parseLocation("/")).toEqual({ packages: "", view: "" });
  });

  it("should return the packages segment and the default view when no view is specified", () => {
    expect(parseLocation("/react,lodash")).toEqual({
      packages: "react,lodash",
      view: "",
    });
  });

  it("should extract the files view from the path", () => {
    expect(parseLocation("/react,lodash/files")).toEqual({
      packages: "react,lodash",
      view: "files",
    });
  });

  it("should extract the security view from the path", () => {
    expect(parseLocation("/react/security")).toEqual({
      packages: "react",
      view: "security",
    });
  });

  it("should handle encoded package names", () => {
    expect(parseLocation("/%40scope%2Fpkg/files")).toEqual({
      packages: "%40scope%2Fpkg",
      view: "files",
    });
  });
});
