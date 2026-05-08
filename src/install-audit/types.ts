import type { LifecycleHook } from "../dependency-tree";

import type { ScriptSeverity } from "./analyzers";

export interface HookFinding {
  hook: LifecycleHook;
  matches: { pattern: string; severity: ScriptSeverity }[];
  scriptSnippet: string;
}

export interface PackageAuditResult {
  installScriptFindings: HookFinding[];
  packageName: string;
  version: string;
}

export interface CategoryCount {
  count: number;
  label: string;
}
