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
    const nameTieBreaker = a.packageInformation.packageName.localeCompare(
      b.packageInformation.packageName,
    );
    const versionTieBreaker = a.packageInformation.version.localeCompare(
      b.packageInformation.version,
    );

    const comparison =
      sortKey === "name"
        ? nameTieBreaker || versionTieBreaker
        : a[sortKey] - b[sortKey];

    return (comparison || nameTieBreaker || versionTieBreaker) * multiplier;
  });
};
