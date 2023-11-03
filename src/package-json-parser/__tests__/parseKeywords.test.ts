import { describe, expect, it } from "vitest";
import { parseKeywords } from "../parseKeywords";

describe("parseKeywords", () => {
  describe("Array of strings", () => {
    it("should return a string with comma-separated values", () => {
      expect(parseKeywords(["a", "b", "c"])).toBe("a, b, c");
    });
  });

  describe("String (invalid syntax)", () => {
    it("should return the original string", () => {
      expect(parseKeywords("a, b, c")).toBe("a, b, c");
    });
  });

  describe("Undefined", () => {
    it("should return null", () => {
      expect(parseKeywords(undefined)).toBeNull();
    });
  });
});
