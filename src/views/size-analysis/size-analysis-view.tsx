import "./size-analysis-view.css";

import { useMemo, useState } from "react";

import { Dropdown } from "../../components";
import type { DependencyTreeData } from "../../types";
import { getFormattedSize } from "../../utils";

import { SizeCompositionPanel } from "./size-composition-panel";
import {
  getOutlierData,
  getSizeCompositionData,
  getSizeData,
  getSortedRows,
  type SortDirection,
  type SortKey,
} from "./utils";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "size", label: "Package size" },
  { key: "fileCount", label: "Package file count" },
  { key: "directDependencyCount", label: "Direct dependency count" },
  { key: "transitiveDependencyCount", label: "Transitive dependency count" },
  { key: "dependenciesSize", label: "Total dependencies size" },
  { key: "depth", label: "Tree depth" },
  { key: "name", label: "Package name" },
];

interface Props {
  dependencyTreeData: DependencyTreeData;
}

export const SizeAnalysisView = ({ dependencyTreeData }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>("size");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const { rows, deepestDependencyChain, mostDependedOnPackage } = useMemo(
    () => getSizeData(dependencyTreeData),
    [dependencyTreeData],
  );

  const compositionData = useMemo(() => getSizeCompositionData(rows), [rows]);

  const outlierData = useMemo(
    () => getOutlierData(rows, compositionData.totalSize),
    [rows, compositionData.totalSize],
  );

  const sortedRows = useMemo(
    () => getSortedRows({ rows, sortKey, sortDirection }),
    [rows, sortKey, sortDirection],
  );

  const { maxSize, totalSize } = compositionData;

  const handleChangeSortKey = (key: SortKey) => {
    setSortKey(key);
  };

  const handleToggleDirection = () => {
    setSortDirection((previousState) =>
      previousState === "desc" ? "asc" : "desc",
    );
  };

  return (
    <div className="size-analysis-view">
      <div className="master-detail-layout">
        <div className="size-list">
          <div className="size-list__controls">
            <span className="size-list__label">Sort by</span>
            <Dropdown
              options={sortOptions}
              value={sortKey}
              onChange={handleChangeSortKey}
            />
            <button
              className="size-list__direction"
              onClick={handleToggleDirection}
              title={sortDirection === "desc" ? "Descending" : "Ascending"}
            >
              {sortDirection === "desc" ? "\u25BE" : "\u25B4"}
            </button>
          </div>
          <div className="size-list__items">
            {sortedRows.map((row) => {
              const percentage = (row.size / (totalSize || 1)) * 100;
              const percentageLabel =
                percentage > 0 && percentage < 0.1
                  ? "<0.1%"
                  : `${percentage.toFixed(1)}%`;

              return (
                <div key={row.installationPath} className="size-list-item">
                  <div className="size-list-item__content">
                    <div className="size-list-item__info">
                      <div className="size-list-item__header">
                        <span className="size-list-item__name">
                          {row.packageInformation.packageName}
                        </span>
                        <span className="size-list-item__version">
                          {row.packageInformation.version}
                        </span>
                      </div>
                      <div className="size-list-item__meta">
                        <span className="size-list-item__stat">
                          {row.fileCount} files
                        </span>
                        <span className="size-list-item__stat size-list-item__stat--orange">
                          {row.dependenciesSize > 0
                            ? `${getFormattedSize(row.dependenciesSize)} deps size`
                            : "No deps"}
                        </span>
                      </div>
                      <div className="size-list-item__meta">
                        <span className="size-list-item__stat">
                          depth {row.depth}
                        </span>
                        <span className="size-list-item__stat">
                          {row.directDependencyCount} direct deps
                        </span>
                        <span className="size-list-item__stat">
                          {row.transitiveDependencyCount} transitive deps
                        </span>
                      </div>
                    </div>
                    <div className="size-list-item__size">
                      <span className="size-list-item__size-value">
                        {getFormattedSize(row.size)}
                      </span>
                      <span className="size-list-item__percentage">
                        {percentageLabel}
                      </span>
                    </div>
                  </div>
                  <div className="size-list-item__bar-track">
                    <div
                      className="size-list-item__bar-fill"
                      style={{
                        width: `${(row.size / (maxSize || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="size-analysis-view__detail">
          <SizeCompositionPanel
            compositionData={compositionData}
            outlierData={outlierData}
            deepestDependencyChain={deepestDependencyChain}
            mostDependedOnPackage={mostDependedOnPackage}
            packageCount={rows.length}
          />
        </div>
      </div>
    </div>
  );
};
