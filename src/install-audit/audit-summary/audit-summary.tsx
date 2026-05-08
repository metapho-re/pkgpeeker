import "./audit-summary.css";

import { getPluralizedQuantity } from "../../shared";

import type { CategoryCount } from "../types";

interface Props {
  categoryCounts: CategoryCount[];
  packagesWithFindings: number;
  totalPackages: number;
}

export const AuditSummary = ({
  categoryCounts,
  packagesWithFindings,
  totalPackages,
}: Props) => (
  <header className="audit-summary">
    <h2 className="audit-summary__title">Install Audit</h2>
    <p className="audit-summary__subtitle">
      {packagesWithFindings} of{" "}
      {getPluralizedQuantity(totalPackages, "package")}{" "}
      {packagesWithFindings === 1 ? "has" : "have"} findings.
    </p>
    <ul className="audit-summary__categories">
      {categoryCounts.map(({ count, label }) => (
        <li key={label} className="audit-summary__category">
          <span className="audit-summary__category-label">{label}</span>
          <span className="audit-summary__category-count">
            {getPluralizedQuantity(count, "package")}
          </span>
        </li>
      ))}
    </ul>
  </header>
);
