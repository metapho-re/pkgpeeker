import { describe, expect, it } from "vitest";
import { parseModuleFormat } from "../parseModuleFormat";

describe("parseModuleFormat", () => {
  it('should return "cjs" when no relevant fields are present', () => {
    expect(parseModuleFormat({})).toBe("cjs");
  });

  it('should return "cjs" when type is "commonjs"', () => {
    expect(parseModuleFormat({ type: "commonjs" })).toBe("cjs");
  });

  it('should return "esm" when type is "module"', () => {
    expect(parseModuleFormat({ type: "module" })).toBe("esm");
  });

  it('should return "dual" when exports has both import and require', () => {
    expect(
      parseModuleFormat({
        exports: { import: "./index.mjs", require: "./index.cjs" },
      }),
    ).toBe("dual");
  });

  it('should return "dual" when module field is present without type "module"', () => {
    expect(
      parseModuleFormat({ main: "./index.js", module: "./index.mjs" }),
    ).toBe("dual");
  });

  it('should return "dual" when type is "module" but main points to a cjs file', () => {
    expect(parseModuleFormat({ type: "module", main: "./index.cjs" })).toBe(
      "dual",
    );
  });

  it('should return "esm" when type is "module" and main is a .js file', () => {
    expect(parseModuleFormat({ type: "module", main: "./index.js" })).toBe(
      "esm",
    );
  });

  it('should return "esm" when type is "module" and main ends with .mjs', () => {
    expect(parseModuleFormat({ type: "module", main: "./index.mjs" })).toBe(
      "esm",
    );
  });

  it('should return "dual" when exports has subpath conditions with import and require', () => {
    expect(
      parseModuleFormat({
        exports: {
          ".": { import: "./index.mjs", require: "./index.cjs" },
          "./utils": { import: "./utils.mjs", require: "./utils.cjs" },
        },
      }),
    ).toBe("dual");
  });

  it('should return "cjs" when exports is not an object', () => {
    expect(parseModuleFormat({ exports: "./index.js" })).toBe("cjs");
  });

  it('should return "cjs" when exports has only import', () => {
    expect(parseModuleFormat({ exports: { import: "./index.mjs" } })).toBe(
      "cjs",
    );
  });
});
