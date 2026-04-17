import "./size-analysis-view.css";

import { type ChangeEvent, useMemo, useState } from "react";

import type { DependencyTreeData } from "../../types";
import { getFormattedSize } from "../../utils";

import {
  getRows,
  getSortedRows,
  type SortDirection,
  type SortKey,
} from "./utils";

const sortLabelEntries = Object.entries({
  size: "Package size",
  fileCount: "Package file count",
  directDependencyCount: "Direct dependency count",
  transitiveDependencyCount: "Transitive dependency count",
  dependenciesSize: "Total dependencies size",
  depth: "Tree depth",
  name: "Package name",
} satisfies Record<SortKey, string>) as [SortKey, string][];

interface Props {
  dependencyTreeData: DependencyTreeData;
}

export const SizeAnalysisView = ({ dependencyTreeData }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>("size");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const rows = useMemo(() => getRows(dependencyTreeData), [dependencyTreeData]);

  const sortedRows = useMemo(
    () => getSortedRows({ rows, sortKey, sortDirection }),
    [rows, sortKey, sortDirection],
  );

  const { maxSize, totalSize } = useMemo(() => {
    let maxSize = 1;
    let totalSize = 0;

    for (const row of rows) {
      if (row.size > maxSize) {
        maxSize = row.size;
      }

      totalSize += row.size;
    }

    return { maxSize, totalSize: totalSize || 1 };
  }, [rows]);

  const handleSortKeyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSortKey(event.target.value as SortKey);
  };

  const handleDirectionToggle = () => {
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
            <select
              className="size-list__select"
              value={sortKey}
              onChange={handleSortKeyChange}
            >
              {sortLabelEntries.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <button
              className="size-list__direction"
              onClick={handleDirectionToggle}
              title={sortDirection === "desc" ? "Descending" : "Ascending"}
            >
              {sortDirection === "desc" ? "\u25BE" : "\u25B4"}
            </button>
          </div>
          <div className="size-list__items">
            {sortedRows.map((row) => {
              const percentage = (row.size / totalSize) * 100;
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
                      style={{ width: `${(row.size / maxSize) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="size-analysis-view__detail">
          <div className="size-analysis-view__placeholder">
            Insights coming soon
          </div>
        </div>
      </div>
    </div>
  );
};
