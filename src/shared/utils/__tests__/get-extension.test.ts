import { describe, expect, it } from "vitest";

import { getExtension } from "../get-extension";

describe("getExtension", () => {
  it("should return simple extensions", () => {
    expect(getExtension("index.js")).toBe(".js");
    expect(getExtension("styles.css")).toBe(".css");
    expect(getExtension("data.json")).toBe(".json");
  });

  it("should return compound .d.ts extensions", () => {
    expect(getExtension("index.d.ts")).toBe(".d.ts");
    expect(getExtension("index.d.mts")).toBe(".d.mts");
    expect(getExtension("index.d.cts")).toBe(".d.cts");
  });

  it("should lowercase the extension", () => {
    expect(getExtension("README.MD")).toBe(".md");
    expect(getExtension("bundle.JS")).toBe(".js");
  });

  it("should return 'other' for files without an extension", () => {
    expect(getExtension("LICENSE")).toBe("other");
    expect(getExtension("Makefile")).toBe("other");
  });

  it("should return 'other' for dotfiles", () => {
    expect(getExtension(".gitignore")).toBe("other");
    expect(getExtension(".eslintrc")).toBe("other");
  });

  it("should return the last extension for multi-dot filenames", () => {
    expect(getExtension("app.config.js")).toBe(".js");
    expect(getExtension("package.lock.json")).toBe(".json");
  });
});
