import type { Row, SortDirection, SortKey } from "./types";

interface Params {
  rows: Row[];
  sortKey: SortKey;
  sortDirection: SortDirection;
}

export const getSortedRows = ({
  rows,
  sortKey,
  sortDirection,
}: Params): Row[] => {
  const multiplier = sortDirection === "desc" ? -1 : 1;

  return [...rows].sort((a, b) => {
    const tieBreaker = a.packageInformation.packageName.localeCompare(
      b.packageInformation.packageName,
    );

    const comparison =
      sortKey === "name" ? tieBreaker : a[sortKey] - b[sortKey];

    return (comparison || tieBreaker) * multiplier;
  });
};
