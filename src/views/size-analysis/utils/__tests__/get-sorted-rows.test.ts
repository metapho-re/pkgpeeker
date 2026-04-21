import { describe, expect, it } from "vitest";

import { getSortedRows } from "../get-sorted-rows";

import { makePackage, makeRow } from "./helpers";

describe("getSortedRows", () => {
  const rowA = makeRow("alpha", { size: 300, depth: 1 });
  const rowB = makeRow("beta", { size: 100, depth: 3 });
  const rowC = makeRow("gamma", { size: 200, depth: 2 });

  it("should sort by size descending", () => {
    const sorted = getSortedRows({
      rows: [rowA, rowB, rowC],
      sortKey: "size",
      sortDirection: "desc",
    });

    expect(sorted.map(({ size }) => size)).toEqual([300, 200, 100]);
  });

  it("should sort by size ascending", () => {
    const sorted = getSortedRows({
      rows: [rowA, rowB, rowC],
      sortKey: "size",
      sortDirection: "asc",
    });

    expect(sorted.map(({ size }) => size)).toEqual([100, 200, 300]);
  });

  it("should sort by name ascending", () => {
    const sorted = getSortedRows({
      rows: [rowC, rowA, rowB],
      sortKey: "name",
      sortDirection: "asc",
    });

    expect(
      sorted.map(({ packageInformation }) => packageInformation.packageName),
    ).toEqual(["alpha", "beta", "gamma"]);
  });

  it("should sort by depth descending", () => {
    const sorted = getSortedRows({
      rows: [rowA, rowB, rowC],
      sortKey: "depth",
      sortDirection: "desc",
    });

    expect(sorted.map(({ depth }) => depth)).toEqual([3, 2, 1]);
  });

  it("should break ties by name", () => {
    const row1 = makeRow("zeta", { size: 100 });
    const row2 = makeRow("alpha", { size: 100 });

    const descSorted = getSortedRows({
      rows: [row1, row2],
      sortKey: "size",
      sortDirection: "desc",
    });

    expect(
      descSorted.map(
        ({ packageInformation }) => packageInformation.packageName,
      ),
    ).toEqual(["zeta", "alpha"]);

    const ascSorted = getSortedRows({
      rows: [row1, row2],
      sortKey: "size",
      sortDirection: "asc",
    });

    expect(
      ascSorted.map(({ packageInformation }) => packageInformation.packageName),
    ).toEqual(["alpha", "zeta"]);
  });

  it("should break name ties by version", () => {
    const row1 = makeRow("lodash", {
      packageInformation: {
        packageName: "lodash",
        ...makePackage({ version: "4.17.21" }),
      },
    });
    const row2 = makeRow("lodash", {
      packageInformation: {
        packageName: "lodash",
        ...makePackage({ version: "3.10.1" }),
      },
    });

    const sorted = getSortedRows({
      rows: [row1, row2],
      sortKey: "name",
      sortDirection: "asc",
    });

    expect(
      sorted.map(({ packageInformation }) => packageInformation.version),
    ).toEqual(["3.10.1", "4.17.21"]);
  });

  it("should not mutate the input array", () => {
    const rows = [rowC, rowA, rowB];

    getSortedRows({ rows, sortKey: "size", sortDirection: "asc" });

    expect(rows[0]).toBe(rowC);
  });
});
