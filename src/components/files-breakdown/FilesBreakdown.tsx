import { FolderStatistics } from "../../types";
import { getFormattedSize } from "../../utils";
import { Popover } from "../popover";
import { getExtensionColor } from "./getExtensionColor";
import "./FilesBreakdown.css";

const getPercentage = (value: number, total: number): number =>
  (value * 100) / total;

const getFormattedPercentage = (value: number): string =>
  value < 0.05 ? "< 0.1%" : `${value.toFixed(1)}%`;

type Props = Omit<FolderStatistics, "numberOfFilesInFolder">;

export const FilesBreakdown = ({
  folderSizeInBytes,
  ...statisticsByExtension
}: Props) => {
  const folderStatisticsEntries = Object.entries(statisticsByExtension).sort(
    ([, valueA], [, valueB]) => valueB - valueA
  );

  return (
    <div>
      <div className="breakdown-bar">
        {folderStatisticsEntries.map(([key, value]) => (
          <div
            style={{
              width: `${getPercentage(value, folderSizeInBytes)}%`,
              backgroundColor: getExtensionColor(key),
            }}
          >
            <Popover
              key={key}
              content={
                <span>
                  {key}&nbsp;-&nbsp;{getFormattedSize(value)}&nbsp;-&nbsp;
                  {getFormattedPercentage(
                    getPercentage(value, folderSizeInBytes)
                  )}
                </span>
              }
            >
              <div className="breakdown-bar__filler" />
            </Popover>
          </div>
        ))}
      </div>
      <div className="extensions">
        {folderStatisticsEntries.map(([key, value]) => (
          <div key={key} className="extensions__tag">
            <div
              className="color-bubble"
              style={{
                backgroundColor: getExtensionColor(key),
              }}
            />

            <p className="extensions__label">
              {key}:&nbsp;
              {getFormattedPercentage(getPercentage(value, folderSizeInBytes))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
