import type { MismatchEntry, OutlierData, Row } from "./types";

// Median bytes/file from the top 200 most popular npm packages
// (scripts/compute-bytes-per-file-baseline.mjs)
const BASELINE_BYTES_PER_FILE = 3026;
const CONCENTRATION_THRESHOLD = 0.8;
const MISMATCH_FACTOR = 8;
const MIN_SIZE_SHARE = 0.02;

export const getOutlierData = (rows: Row[], totalSize: number): OutlierData => {
  if (rows.length === 0) {
    return { concentration: null, mismatches: [] };
  }

  const sortedRows = [...rows].sort((a, b) => b.size - a.size);

  let concentration = null;

  if (sortedRows.length >= 2 && totalSize > 0) {
    const packageNames: string[] = [];

    let accumulatedSize = 0;

    for (const row of sortedRows) {
      accumulatedSize += row.size;
      packageNames.push(row.packageInformation.packageName);

      if (accumulatedSize / totalSize >= CONCENTRATION_THRESHOLD) {
        break;
      }
    }

    if (packageNames.length < sortedRows.length) {
      concentration = {
        count: packageNames.length,
        percentage: accumulatedSize / totalSize,
        packageNames,
      };
    }
  }

  const mismatches: MismatchEntry[] = [];

  for (const row of rows) {
    if (row.fileCount === 0 || totalSize === 0) {
      continue;
    }

    if (row.size / totalSize < MIN_SIZE_SHARE) {
      continue;
    }

    const bytesPerFile = row.size / row.fileCount;

    let kind: MismatchEntry["kind"] | null = null;

    if (bytesPerFile > BASELINE_BYTES_PER_FILE * MISMATCH_FACTOR) {
      kind = "bundled";
    }

    if (bytesPerFile < BASELINE_BYTES_PER_FILE / MISMATCH_FACTOR) {
      kind = "fragmented";
    }

    if (kind) {
      mismatches.push({
        packageName: row.packageInformation.packageName,
        version: row.packageInformation.version,
        size: row.size,
        fileCount: row.fileCount,
        bytesPerFile,
        kind,
      });
    }
  }

  mismatches.sort((a, b) => b.bytesPerFile - a.bytesPerFile);

  return { concentration, mismatches };
};
