import { describe, expect, it } from "vitest";

import { parseScripts } from "../parse-scripts";

describe("parseScripts", () => {
  it("should extract all three lifecycle hooks when present", () => {
    expect(
      parseScripts({
        preinstall: "echo pre",
        install: "echo install",
        postinstall: "echo post",
      }),
    ).toEqual({
      preinstall: "echo pre",
      install: "echo install",
      postinstall: "echo post",
    });
  });

  it("should ignore unrelated script entries", () => {
    expect(
      parseScripts({
        build: "tsc",
        test: "vitest",
        postinstall: "node ./setup.js",
      }),
    ).toEqual({
      preinstall: null,
      install: null,
      postinstall: "node ./setup.js",
    });
  });

  it("should return null fields when scripts is undefined", () => {
    expect(parseScripts(undefined)).toEqual({
      preinstall: null,
      install: null,
      postinstall: null,
    });
  });

  it("should return null fields when scripts is null", () => {
    expect(parseScripts(null)).toEqual({
      preinstall: null,
      install: null,
      postinstall: null,
    });
  });

  it("should return null fields when scripts is not an object", () => {
    expect(parseScripts("preinstall: echo")).toEqual({
      preinstall: null,
      install: null,
      postinstall: null,
    });
  });

  it("should return null when a hook value is not a string", () => {
    expect(parseScripts({ preinstall: 42, install: true })).toEqual({
      preinstall: null,
      install: null,
      postinstall: null,
    });
  });

  it("should treat empty/whitespace-only strings as null", () => {
    expect(parseScripts({ preinstall: "", install: "   " })).toEqual({
      preinstall: null,
      install: null,
      postinstall: null,
    });
  });
});
