import { describe, expect, it } from "vitest";
import { parseLicense } from "../parse-license";

describe("parseLicense", () => {
  it("should return a single license with SPDX type and url", () => {
    expect(
      parseLicense({ license: "BSD-3-Clause", repositoryUrl: null }),
    ).toEqual([
      { type: "BSD-3-Clause", url: "https://spdx.org/licenses/BSD-3-Clause" },
    ]);
  });

  it("should return multiple licenses from a parenthesized SPDX expression", () => {
    expect(
      parseLicense({
        license: "(ISC OR GPL-3.0 OR BSD-3-Clause)",
        repositoryUrl: null,
      }),
    ).toEqual([
      { type: "ISC", url: "https://spdx.org/licenses/ISC" },
      { type: "GPL-3.0", url: "https://spdx.org/licenses/GPL-3.0" },
      { type: "BSD-3-Clause", url: "https://spdx.org/licenses/BSD-3-Clause" },
    ]);
  });

  it("should return multiple licenses from an unparenthesized SPDX expression", () => {
    expect(
      parseLicense({
        license: "MIT OR Apache-2.0",
        repositoryUrl: null,
      }),
    ).toEqual([
      { type: "MIT", url: "https://spdx.org/licenses/MIT" },
      { type: "Apache-2.0", url: "https://spdx.org/licenses/Apache-2.0" },
    ]);
  });

  it("should return a Custom license with filename url from SEE LICENSE IN syntax", () => {
    expect(
      parseLicense({
        license: "SEE LICENSE IN custom_license.txt",
        repositoryUrl: "https://github.com/user/repository",
      }),
    ).toEqual([
      {
        type: "Custom",
        url: "https://github.com/user/repository/blob/master/custom_license.txt",
      },
    ]);
  });

  it("should return the provided deprecated license object", () => {
    expect(
      parseLicense({
        license: { type: "BSD-3-Clause", url: "some_url" },
        repositoryUrl: null,
      }),
    ).toEqual([{ type: "BSD-3-Clause", url: "some_url" }]);
  });

  it("should return the provided deprecated array of license objects", () => {
    expect(
      parseLicense({
        license: [
          { type: "BSD-3-Clause", url: "some_url" },
          { type: "MIT", url: "some_other_url" },
        ],
        repositoryUrl: null,
      }),
    ).toEqual([
      { type: "BSD-3-Clause", url: "some_url" },
      { type: "MIT", url: "some_other_url" },
    ]);
  });

  it("should return a Custom license when the value is a URL", () => {
    expect(
      parseLicense({
        license: "https://path-to-the-license",
        repositoryUrl: null,
      }),
    ).toEqual([{ type: "Custom", url: "https://path-to-the-license" }]);
  });

  it("should return UNLICENSED with no url", () => {
    expect(
      parseLicense({ license: "UNLICENSED", repositoryUrl: null }),
    ).toEqual([{ type: "UNLICENSED", url: null }]);
  });

  it("should return None when the license object has an empty type", () => {
    expect(
      parseLicense({
        license: { type: "", url: "https//license.org" },
        repositoryUrl: null,
      }),
    ).toEqual([{ type: "None", url: null }]);
  });

  it("should return None when the license is undefined", () => {
    expect(parseLicense({ license: undefined, repositoryUrl: null })).toEqual([
      { type: "None", url: null },
    ]);
  });
});
