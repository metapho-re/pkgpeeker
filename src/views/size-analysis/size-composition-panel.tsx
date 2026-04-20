import "./size-composition-panel.css";

import { DonutChart, FilesBreakdown } from "../../components";
import { getFormattedSize } from "../../utils";

import type { SizeCompositionData } from "./utils";

const PACKAGE_COLORS = [
  "#7e9cd8",
  "#98bb6c",
  "#ffa066",
  "#e46876",
  "#957fb8",
  "#7aa89f",
  "#e6c384",
  "#d27e99",
  "#7fb4ca",
  "#a3d4d5",
  "#ff5d62",
  "#727169",
];

const getPackageColor = (_: string, index: number): string =>
  PACKAGE_COLORS[index % PACKAGE_COLORS.length];

interface Props {
  data: SizeCompositionData;
  packageCount: number;
}

export const SizeCompositionPanel = ({ data, packageCount }: Props) => {
  const {
    totalSize,
    totalFileCount,
    uniquePackageCount,
    packageSizeEntries,
    extensionSizeEntries,
    largestFileDetails,
  } = data;

  return (
    <div className="size-composition">
      <div className="size-composition__stats">
        <div className="composition-stat-card">
          <p className="composition-stat-card__label">Total install size</p>
          <p className="composition-stat-card__value composition-stat-card__value--green">
            {getFormattedSize(totalSize)}
          </p>
          <p className="composition-stat-card__sub">{packageCount} packages</p>
        </div>
        <div className="composition-stat-card">
          <p className="composition-stat-card__label">Total files</p>
          <p className="composition-stat-card__value composition-stat-card__value--blue">
            {totalFileCount.toLocaleString()}
          </p>
          <p className="composition-stat-card__sub">across all packages</p>
        </div>
        <div className="composition-stat-card">
          <p className="composition-stat-card__label">Package duplication</p>
          <p className="composition-stat-card__value composition-stat-card__value--purple">
            {uniquePackageCount} unique package{uniquePackageCount !== 1 && "s"}
          </p>
          <p className="composition-stat-card__sub">
            {packageCount} installations
            {packageCount > uniquePackageCount &&
              ` (${packageCount - uniquePackageCount} duplicated)`}
          </p>
        </div>
        <div className="composition-stat-card">
          <p className="composition-stat-card__label">Largest file</p>
          {largestFileDetails ? (
            <>
              <p className="composition-stat-card__value composition-stat-card__value--orange">
                {getFormattedSize(largestFileDetails.sizeInBytes)}
              </p>
              <p
                className="composition-stat-card__sub"
                title={`${largestFileDetails.packageName}/${largestFileDetails.filePath}`}
              >
                {largestFileDetails.packageName}/{largestFileDetails.filePath}
              </p>
            </>
          ) : (
            <p className="composition-stat-card__value">—</p>
          )}
        </div>
      </div>
      <div className="composition-charts">
        <div className="composition-section">
          <p className="composition-section__header">Size share per package</p>
          <DonutChart
            entries={packageSizeEntries}
            total={totalSize}
            getColor={getPackageColor}
          />
        </div>
        <div className="composition-section">
          <p className="composition-section__header">
            File types across all packages
          </p>
          <FilesBreakdown
            folderSizeInBytes={totalSize}
            {...extensionSizeEntries}
          />
        </div>
      </div>
    </div>
  );
};
