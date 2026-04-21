import type { Row, SizeCompositionData } from "./types";

export const getSizeCompositionData = (rows: Row[]): SizeCompositionData => {
  let totalSize = 0;
  let maxSize = 0;
  let totalFileCount = 0;
  let largestFileDetails: SizeCompositionData["largestFileDetails"] = null;

  const uniquePackageNames = new Set<string>();
  const extensionSizeMap: Record<string, number> = {};
  const packageSizeEntries: [string, number][] = [];

  for (const row of rows) {
    totalSize += row.size;
    totalFileCount += row.fileCount;
    uniquePackageNames.add(row.packageInformation.packageName);

    if (row.size > maxSize) {
      maxSize = row.size;
    }

    packageSizeEntries.push([
      `${row.packageInformation.packageName}@${row.packageInformation.version}`,
      row.size,
    ]);

    if (
      row.largestFileDetails &&
      row.largestFileDetails.sizeInBytes >
        (largestFileDetails?.sizeInBytes || 0)
    ) {
      largestFileDetails = {
        packageName: row.packageInformation.packageName,
        filePath: row.largestFileDetails.filePath.slice(
          `${row.installationPath}/`.length,
        ),
        sizeInBytes: row.largestFileDetails.sizeInBytes,
      };
    }

    if (row.packageInformation.folderStatistics) {
      for (const [key, value] of Object.entries(
        row.packageInformation.folderStatistics,
      )) {
        if (key === "folderSizeInBytes" || key === "numberOfFilesInFolder") {
          continue;
        }

        extensionSizeMap[key] = (extensionSizeMap[key] || 0) + value;
      }
    }
  }

  const uniquePackageCount = uniquePackageNames.size;

  packageSizeEntries.sort(([, a], [, b]) => b - a);

  const extensionSizeEntries: Record<string, number> = Object.fromEntries(
    Object.entries(extensionSizeMap).sort(([, a], [, b]) => b - a),
  );

  return {
    totalSize,
    maxSize,
    totalFileCount,
    uniquePackageCount,
    packageSizeEntries,
    extensionSizeEntries,
    largestFileDetails,
  };
};
