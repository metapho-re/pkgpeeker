import "./install-audit-view.css";

import { useMemo } from "react";

import type { DependencyAnalysis } from "../../dependency-tree";
import { getPluralizedQuantity } from "../../shared";

import { AuditSummary } from "../audit-summary";
import { PackageFindingsCard } from "../package-findings-card";

import { getAuditData } from "./get-audit-data";

interface Props {
  dependencyAnalysis: DependencyAnalysis;
}

export const InstallAuditView = ({ dependencyAnalysis }: Props) => {
  const { categoryCounts, results, totalPackages } = useMemo(
    () => getAuditData(dependencyAnalysis),
    [dependencyAnalysis],
  );

  if (results.length === 0) {
    return (
      <div className="install-audit-view install-audit-view--empty">
        <div className="install-audit-view__empty">
          <h2 className="install-audit-view__title">Install Audit</h2>
          <p className="install-audit-view__description">
            No notable patterns were found across{" "}
            {getPluralizedQuantity(totalPackages, "installed package")}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="install-audit-view">
      <AuditSummary
        categoryCounts={categoryCounts}
        packagesWithFindings={results.length}
        totalPackages={totalPackages}
      />
      <ul className="install-audit-view__results">
        {results.map((result) => (
          <PackageFindingsCard
            key={`${result.packageName}@${result.version}`}
            result={result}
          />
        ))}
      </ul>
    </div>
  );
};
