import { describe, expect, it } from "vitest";
import { parseLicense } from "../parseLicense";

describe("parseLicense", () => {
  describe("Single SPDX license", () => {
    it(
      "should return an array with a single valid license object with SPDX type and url"
    );
    expect(
      parseLicense({ license: "BSD-3-Clause", repositoryUrl: null })
    ).toEqual([
      { type: "BSD-3-Clause", url: "https://spdx.org/licenses/BSD-3-Clause" },
    ]);
  });

  describe("Multiple SPDX licenses", () => {
    it(
      "should return an array with mutiple valid license objects with SPDX type and url"
    );
    expect(
      parseLicense({
        license: "(ISC OR GPL-3.0 OR BSD-3-Clause)",
        repositoryUrl: null,
      })
    ).toEqual([
      { type: "ISC", url: "https://spdx.org/licenses/ISC" },
      { type: "GPL-3.0", url: "https://spdx.org/licenses/GPL-3.0" },
      { type: "BSD-3-Clause", url: "https://spdx.org/licenses/BSD-3-Clause" },
    ]);
  });

  describe("Custom license", () => {
    it(
      "should return an array with a single valid license object with Custom type and provided filename url"
    );
    expect(
      parseLicense({
        license: "SEE LICENSE IN custom_license.txt",
        repositoryUrl: "https://github.com/user/repository",
      })
    ).toEqual([
      {
        type: "Custom",
        url: "https://github.com/user/repository/blob/master/custom_license.txt",
      },
    ]);
  });

  describe("Deprecated license object", () => {
    it("should return an array with the provided license object");
    expect(
      parseLicense({
        license: { type: "BSD-3-Clause", url: "some_url" },
        repositoryUrl: null,
      })
    ).toEqual([{ type: "BSD-3-Clause", url: "some_url" }]);
  });

  describe("Deprecated array of license objects", () => {
    it("should return the array of provided license objects");
    expect(
      parseLicense({
        license: [
          { type: "BSD-3-Clause", url: "some_url" },
          { type: "MIT", url: "some_other_url" },
        ],
        repositoryUrl: null,
      })
    ).toEqual([
      { type: "BSD-3-Clause", url: "some_url" },
      { type: "MIT", url: "some_other_url" },
    ]);
  });

  describe("Invalid yet not uncommon url format", () => {
    it(
      "should return an array with a single valid license object with Custom type and provided url"
    );
    expect(
      parseLicense({
        license: "https://path-to-the-license",
        repositoryUrl: null,
      })
    ).toEqual([{ type: "Custom", url: "https://path-to-the-license" }]);
  });

  describe("Unlicensed", () => {
    it(
      "should return an array with a single valid license object with UNLICENSED type and no url"
    );
    expect(
      parseLicense({ license: "UNLICENSED", repositoryUrl: null })
    ).toEqual([{ type: "UNLICENSED", url: null }]);
  });

  describe("Invalid", () => {
    it(
      "should return an array with a single valid license object with None type and no url"
    );
    expect(
      parseLicense({
        license: { type: "", url: "https//license.org" },
        repositoryUrl: null,
      })
    ).toEqual([{ type: "None", url: null }]);
  });

  describe("Undefined", () => {
    it(
      "should return an array with a single valid license object with None type and no url"
    );
    expect(parseLicense({ license: undefined, repositoryUrl: null })).toEqual([
      { type: "None", url: null },
    ]);
  });
});
