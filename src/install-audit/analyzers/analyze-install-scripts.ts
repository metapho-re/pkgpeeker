import type { LifecycleHook, LifecycleScripts } from "../../dependency-tree";

export type ScriptSeverity = "low" | "medium" | "high";

interface ScriptWarning {
  hook: LifecycleHook;
  pattern: string;
  severity: ScriptSeverity;
  scriptSnippet: string;
}

interface PatternRule {
  matcher: RegExp;
  label: string;
  severity: ScriptSeverity;
}

const patternRules: PatternRule[] = [
  {
    matcher: /\b(?:curl|wget)\b[^|;&\n]*[|]\s*(?:sh|bash|zsh)\b/,
    label: "remote script piped to shell",
    severity: "high",
  },
  { matcher: /\beval\s*\(/, label: "eval()", severity: "high" },
  {
    matcher: /\bFunction\s*\(/,
    label: "Function constructor",
    severity: "high",
  },
  {
    matcher: /\bbase64\s+(?:-d|--decode)\b/,
    label: "base64 decode",
    severity: "high",
  },
  { matcher: /\bcurl\b/, label: "curl", severity: "medium" },
  { matcher: /\bwget\b/, label: "wget", severity: "medium" },
  {
    matcher: /\bchild_process\b/,
    label: "child_process",
    severity: "medium",
  },
  { matcher: /\bchmod\s+\+x\b/, label: "chmod +x", severity: "medium" },
  { matcher: /\brm\s+-rf\b/, label: "rm -rf", severity: "medium" },
];

const HOOKS: LifecycleHook[] = ["preinstall", "install", "postinstall"];

export const analyzeInstallScripts = (
  scripts: LifecycleScripts,
): ScriptWarning[] => {
  const scriptWarnings: ScriptWarning[] = [];

  for (const hook of HOOKS) {
    const script = scripts[hook];

    if (!script) {
      continue;
    }

    const matchedLabels = new Set<string>();

    for (const patternRule of patternRules) {
      if (
        matchedLabels.has(patternRule.label) ||
        !patternRule.matcher.test(script)
      ) {
        continue;
      }

      matchedLabels.add(patternRule.label);

      scriptWarnings.push({
        hook,
        pattern: patternRule.label,
        severity: patternRule.severity,
        scriptSnippet: script,
      });
    }

    if (matchedLabels.size === 0) {
      scriptWarnings.push({
        hook,
        pattern: "lifecycle script present",
        severity: "low",
        scriptSnippet: script,
      });
    }
  }

  return scriptWarnings;
};
