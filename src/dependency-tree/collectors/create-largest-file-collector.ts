import type { CollectorNode, TreeCollector } from "./types";

export interface LargestFileMatch {
  packageName: string;
  filePath: string;
  sizeInBytes: number;
}

export const createLargestFileCollector =
  (): TreeCollector<LargestFileMatch | null> => {
    let largestFileMatch: LargestFileMatch | null = null;

    return {
      collect({ packageName, packageInformation, largestFile }: CollectorNode) {
        if (
          largestFile &&
          largestFile.sizeInBytes > (largestFileMatch?.sizeInBytes || 0)
        ) {
          largestFileMatch = {
            packageName,
            filePath: largestFile.filePath.slice(
              `${packageInformation.installationPath}/`.length,
            ),
            sizeInBytes: largestFile.sizeInBytes,
          };
        }
      },
      getResult() {
        return largestFileMatch;
      },
    };
  };
