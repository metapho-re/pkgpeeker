import "./install-script-findings.css";

import type { HookFinding } from "../types";

interface Props {
  findings: HookFinding[];
}

export const InstallScriptFindings = ({ findings }: Props) => (
  <ul className="script-findings">
    {findings.map((hookFinding) => (
      <li key={hookFinding.hook} className="script-findings__item">
        <div className="script-findings__meta">
          <span className="script-findings__hook">{hookFinding.hook}</span>
          {hookFinding.matches.map((match) => (
            <span
              key={match.pattern}
              className={`severity-badge severity-badge--${match.severity} severity-badge--inline`}
            >
              {match.pattern}
            </span>
          ))}
        </div>
        <pre className="script-findings__snippet">
          {hookFinding.scriptSnippet}
        </pre>
      </li>
    ))}
  </ul>
);
