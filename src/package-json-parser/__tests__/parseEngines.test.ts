import { describe, expect, it } from "vitest";
import { parseEngines } from "../parseEngines";

describe("parseEngines", () => {
  it("should return the node version string when present", () => {
    expect(parseEngines({ node: ">= 18" })).toBe(">= 18");
  });

  it("should return complex version ranges", () => {
    expect(parseEngines({ node: ">=14.0.0 <20.0.0" })).toBe(">=14.0.0 <20.0.0");
  });

  it("should return null when engines is undefined", () => {
    expect(parseEngines(undefined)).toBeNull();
  });

  it("should return null when engines is null", () => {
    expect(parseEngines(null)).toBeNull();
  });

  it("should return null when engines is a string", () => {
    expect(parseEngines("node >= 18")).toBeNull();
  });

  it("should return null when engines has no node field", () => {
    expect(parseEngines({ npm: ">= 9" })).toBeNull();
  });

  it("should return null when node field is not a string", () => {
    expect(parseEngines({ node: 18 })).toBeNull();
  });

  it("should return null when engines is an empty object", () => {
    expect(parseEngines({})).toBeNull();
  });
});
