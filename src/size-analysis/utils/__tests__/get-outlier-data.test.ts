import { describe, expect, it } from "vitest";

import { getOutlierData } from "../get-outlier-data";

import { makeRow } from "./helpers";

describe("getOutlierData", () => {
  describe("concentration", () => {
    it("should return null for empty rows", () => {
      const { concentration } = getOutlierData([], 0);

      expect(concentration).toBeNull();
    });

    it("should return null when a single package covers everything", () => {
      const rows = [makeRow("only", { size: 1000 })];

      const { concentration } = getOutlierData(rows, 1000);

      expect(concentration).toBeNull();
    });

    it("should return null when all packages are needed to reach 80%", () => {
      const rows = [
        makeRow("a", { size: 40, installationPath: "/node_modules/a" }),
        makeRow("b", { size: 30, installationPath: "/node_modules/b" }),
        makeRow("c", { size: 30, installationPath: "/node_modules/c" }),
      ];

      const { concentration } = getOutlierData(rows, 100);

      expect(concentration).toBeNull();
    });

    it("should report how many packages account for 80% of size", () => {
      const rows = [
        makeRow("big", { size: 850, installationPath: "/node_modules/big" }),
        makeRow("med", { size: 100, installationPath: "/node_modules/med" }),
        makeRow("small", {
          size: 50,
          installationPath: "/node_modules/small",
        }),
      ];

      const { concentration } = getOutlierData(rows, 1000);

      expect(concentration).toEqual({
        count: 1,
        percentage: 0.85,
        packageNames: ["big"],
      });
    });

    it("should accumulate packages until threshold is reached", () => {
      const rows = [
        makeRow("a", { size: 500, installationPath: "/node_modules/a" }),
        makeRow("b", { size: 400, installationPath: "/node_modules/b" }),
        makeRow("c", { size: 50, installationPath: "/node_modules/c" }),
        makeRow("d", { size: 50, installationPath: "/node_modules/d" }),
      ];

      const { concentration } = getOutlierData(rows, 1000);

      expect(concentration).toEqual({
        count: 2,
        percentage: 0.9,
        packageNames: ["a", "b"],
      });
    });
  });

  describe("mismatches", () => {
    it("should return an empty array for empty rows", () => {
      const { mismatches } = getOutlierData([], 0);

      expect(mismatches).toEqual([]);
    });

    it("should detect mismatches even with fewer than 3 packages", () => {
      const rows = [
        makeRow("bundled", {
          size: 50000,
          fileCount: 2,
          installationPath: "/node_modules/bundled",
        }),
        makeRow("normal", {
          size: 150000,
          fileCount: 50,
          installationPath: "/node_modules/normal",
        }),
      ];

      const { mismatches } = getOutlierData(rows, 200000);

      expect(mismatches).toHaveLength(1);
      expect(mismatches[0].packageName).toBe("bundled");
      expect(mismatches[0].kind).toBe("bundled");
    });

    it("should flag packages with high bytes/file as bundled", () => {
      const rows = [
        makeRow("bundled", {
          size: 50000,
          fileCount: 2,
          installationPath: "/node_modules/bundled",
        }),
        makeRow("normal-a", {
          size: 150000,
          fileCount: 50,
          installationPath: "/node_modules/normal-a",
        }),
        makeRow("normal-b", {
          size: 120000,
          fileCount: 40,
          installationPath: "/node_modules/normal-b",
        }),
      ];

      const { mismatches } = getOutlierData(rows, 320000);

      expect(mismatches).toHaveLength(1);
      expect(mismatches[0].packageName).toBe("bundled");
      expect(mismatches[0].kind).toBe("bundled");
      expect(mismatches[0].bytesPerFile).toBe(25000);
    });

    it("should flag packages with low bytes/file as fragmented", () => {
      const rows = [
        makeRow("fragmented", {
          size: 10000,
          fileCount: 500,
          installationPath: "/node_modules/fragmented",
        }),
        makeRow("normal-a", {
          size: 150000,
          fileCount: 50,
          installationPath: "/node_modules/normal-a",
        }),
        makeRow("normal-b", {
          size: 120000,
          fileCount: 40,
          installationPath: "/node_modules/normal-b",
        }),
      ];

      const { mismatches } = getOutlierData(rows, 280000);

      expect(mismatches).toHaveLength(1);
      expect(mismatches[0].packageName).toBe("fragmented");
      expect(mismatches[0].kind).toBe("fragmented");
      expect(mismatches[0].bytesPerFile).toBe(20);
    });

    it("should skip packages with less than 2% size share", () => {
      const rows = [
        makeRow("tiny-bundled", {
          size: 50,
          fileCount: 1,
          installationPath: "/node_modules/tiny-bundled",
        }),
        makeRow("normal-a", {
          size: 150000,
          fileCount: 50,
          installationPath: "/node_modules/normal-a",
        }),
        makeRow("normal-b", {
          size: 150000,
          fileCount: 50,
          installationPath: "/node_modules/normal-b",
        }),
      ];

      const { mismatches } = getOutlierData(rows, 300050);

      expect(mismatches).toEqual([]);
    });

    it("should sort mismatches by bytes/file descending", () => {
      const rows = [
        makeRow("fragmented", {
          size: 10000,
          fileCount: 500,
          installationPath: "/node_modules/fragmented",
        }),
        makeRow("bundled", {
          size: 50000,
          fileCount: 2,
          installationPath: "/node_modules/bundled",
        }),
        makeRow("normal-a", {
          size: 150000,
          fileCount: 50,
          installationPath: "/node_modules/normal-a",
        }),
        makeRow("normal-b", {
          size: 120000,
          fileCount: 40,
          installationPath: "/node_modules/normal-b",
        }),
      ];

      const { mismatches } = getOutlierData(rows, 330000);

      expect(mismatches[0].kind).toBe("bundled");
      expect(mismatches[1].kind).toBe("fragmented");
    });
  });
});
