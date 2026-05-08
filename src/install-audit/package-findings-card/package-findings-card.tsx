import "./package-findings-card.css";

import { InstallScriptFindings } from "../install-script-findings";
import type { PackageAuditResult } from "../types";

interface Props {
  result: PackageAuditResult;
}

export const PackageFindingsCard = ({ result }: Props) => (
  <li className="package-card">
    <div className="package-card__header">
      <span className="package-card__name">{result.packageName}</span>
      <span className="package-card__version">{result.version}</span>
    </div>
    {result.installScriptFindings.length > 0 && (
      <div className="package-card__category">
        <h4 className="package-card__category-label">Install Scripts</h4>
        <InstallScriptFindings findings={result.installScriptFindings} />
      </div>
    )}
  </li>
);
