import "./size-composition-panel.css";

import { DonutChart, FilesBreakdown } from "../../components";
import type { PackageIdentifier } from "../../types";
import { getFormattedSize } from "../../utils";

import type {
  MostDependedOnPackage,
  OutlierData,
  SizeCompositionData,
} from "./utils";

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
  compositionData: SizeCompositionData;
  outlierData: OutlierData;
  deepestDependencyChain: PackageIdentifier[] | null;
  mostDependedOnPackage: MostDependedOnPackage | null;
  packageCount: number;
}

export const SizeCompositionPanel = ({
  compositionData,
  outlierData,
  deepestDependencyChain,
  mostDependedOnPackage,
  packageCount,
}: Props) => {
  const {
    totalSize,
    totalFileCount,
    uniquePackageCount,
    leafPackageCount,
    packageSizeEntries,
    extensionSizeEntries,
    largestFileDetails,
  } = compositionData;

  const deepestDependencyChainLabel = deepestDependencyChain
    ?.map(({ name }) => name)
    .join(" › ");

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
          <p className="composition-stat-card__label">
            Most depended-on package
          </p>
          {mostDependedOnPackage ? (
            <>
              <p className="composition-stat-card__value composition-stat-card__value--green">
                {mostDependedOnPackage.name}
              </p>
              <p className="composition-stat-card__sub">
                depended on by {mostDependedOnPackage.dependentCount} package
                {mostDependedOnPackage.dependentCount !== 1 && "s"}
              </p>
            </>
          ) : (
            <p className="composition-stat-card__value">—</p>
          )}
        </div>
        <div className="composition-stat-card">
          <p className="composition-stat-card__label">Leaf packages</p>
          <p className="composition-stat-card__value composition-stat-card__value--yellow">
            {leafPackageCount}
          </p>
          <p className="composition-stat-card__sub">
            out of {packageCount} packages
          </p>
        </div>
        <div className="composition-stat-card composition-stat-card--wide">
          <p className="composition-stat-card__label">
            Deepest dependency chain
          </p>
          {deepestDependencyChain ? (
            <>
              <p className="composition-stat-card__value composition-stat-card__value--yellow">
                {deepestDependencyChain.length} levels
              </p>
              <p
                className="composition-stat-card__sub"
                title={deepestDependencyChainLabel}
              >
                {deepestDependencyChainLabel}
              </p>
            </>
          ) : (
            <p className="composition-stat-card__value">—</p>
          )}
        </div>
        {outlierData.concentration && (
          <div className="composition-stat-card composition-stat-card--wide">
            <p className="composition-stat-card__label">Size concentration</p>
            <p className="composition-stat-card__value">
              <span className="composition-stat-card__value--orange">
                {outlierData.concentration.count} package
                {outlierData.concentration.count !== 1 && "s"}
              </span>{" "}
              <span className="composition-stat-card__suffix">
                make up{" "}
                {(outlierData.concentration.percentage * 100).toFixed(0)}% of
                total size
              </span>
            </p>
            <div className="concentration-tags">
              {outlierData.concentration.packageNames.map((name) => (
                <span key={name} className="concentration-tag">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
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
      {outlierData.mismatches.length > 0 && (
        <div className="composition-section">
          <p className="composition-section__header">
            Size / file count mismatches
          </p>
          <div className="mismatch-list">
            {outlierData.mismatches.map((entry) => (
              <div
                key={`${entry.packageName}@${entry.version}`}
                className="mismatch-entry"
              >
                <div className="mismatch-entry__info">
                  <span className="mismatch-entry__name">
                    {entry.packageName}
                  </span>
                  <span
                    className={`mismatch-entry__badge mismatch-entry__badge--${entry.kind}`}
                  >
                    {entry.kind === "bundled"
                      ? "few large files"
                      : "many small files"}
                  </span>
                </div>
                <div className="mismatch-entry__stats">
                  <span>{getFormattedSize(entry.size)}</span>
                  <span className="mismatch-entry__separator">/</span>
                  <span>{entry.fileCount} files</span>
                  <span className="mismatch-entry__ratio">
                    {getFormattedSize(Math.round(entry.bytesPerFile))}/file
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
