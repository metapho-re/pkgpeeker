import type { DependencyAnalysis, LifecycleHook } from "../../dependency-tree";

import { analyzeInstallScripts, type ScriptSeverity } from "../analyzers";
import type { CategoryCount, HookFinding, PackageAuditResult } from "../types";

const SEVERITY_RANK: Record<ScriptSeverity, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

const getTopSeverity = (findings: HookFinding[]): ScriptSeverity => {
  let topSeverity: ScriptSeverity = "low";

  for (const finding of findings) {
    for (const match of finding.matches) {
      if (SEVERITY_RANK[match.severity] > SEVERITY_RANK[topSeverity]) {
        topSeverity = match.severity;
      }
    }
  }

  return topSeverity;
};

export interface AuditData {
  categoryCounts: CategoryCount[];
  results: PackageAuditResult[];
  totalPackages: number;
}

export const getAuditData = (
  dependencyAnalysis: DependencyAnalysis,
): AuditData => {
  const visitedEntries = new Set<string>();
  const results: PackageAuditResult[] = [];

  for (const entry of Object.values(dependencyAnalysis.flatIndex)) {
    const dedupeKey = `${entry.packageName}@${entry.version}`;

    if (visitedEntries.has(dedupeKey)) {
      continue;
    }

    visitedEntries.add(dedupeKey);

    const lifecycleScripts = entry.packageMetadata?.lifecycleScripts;
    const installScriptFindings: HookFinding[] = [];

    if (lifecycleScripts) {
      const warnings = analyzeInstallScripts(lifecycleScripts);
      const hookMap = new Map<LifecycleHook, HookFinding>();

      for (const warning of warnings) {
        const existingFinding = hookMap.get(warning.hook);

        if (existingFinding) {
          existingFinding.matches.push({
            pattern: warning.pattern,
            severity: warning.severity,
          });
        } else {
          hookMap.set(warning.hook, {
            hook: warning.hook,
            matches: [{ pattern: warning.pattern, severity: warning.severity }],
            scriptSnippet: warning.scriptSnippet,
          });
        }
      }

      installScriptFindings.push(...hookMap.values());
    }

    const hasFindings = installScriptFindings.length > 0;

    if (hasFindings) {
      results.push({
        installScriptFindings,
        packageName: entry.packageName,
        version: entry.version,
      });
    }
  }

  results.sort((a, b) => {
    const severityDelta =
      SEVERITY_RANK[getTopSeverity(b.installScriptFindings)] -
      SEVERITY_RANK[getTopSeverity(a.installScriptFindings)];

    if (severityDelta !== 0) {
      return severityDelta;
    }

    return a.packageName.localeCompare(b.packageName);
  });

  const categoryCounts: CategoryCount[] = [];
  const resultsWithInstallScripts = results.filter(
    ({ installScriptFindings }) => installScriptFindings.length > 0,
  );

  if (resultsWithInstallScripts.length > 0) {
    categoryCounts.push({
      count: resultsWithInstallScripts.length,
      label: "Install Scripts",
    });
  }

  return { categoryCounts, results, totalPackages: visitedEntries.size };
};
