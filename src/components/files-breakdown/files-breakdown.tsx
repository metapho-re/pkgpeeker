import type { FolderStatistics } from "../../types";

import { DonutChart } from "../donut-chart";

import { getExtensionColor } from "./get-extension-color";

const getColor = (key: string): string => getExtensionColor(key);

type Props = Omit<FolderStatistics, "numberOfFilesInFolder">;

export const FilesBreakdown = ({
  folderSizeInBytes,
  ...statisticsByExtension
}: Props) => {
  const entries = Object.entries(statisticsByExtension).sort(
    ([, valueA], [, valueB]) => valueB - valueA,
  );

  return (
    <DonutChart
      entries={entries}
      total={folderSizeInBytes}
      getColor={getColor}
    />
  );
};
