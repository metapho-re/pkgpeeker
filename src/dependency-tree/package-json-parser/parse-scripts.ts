import type { LifecycleScripts } from "./types";

const getScriptString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

export const parseScripts = (scripts: unknown): LifecycleScripts => {
  if (typeof scripts !== "object" || scripts === null) {
    return { preinstall: null, install: null, postinstall: null };
  }

  const record = scripts as Record<string, unknown>;

  return {
    preinstall: getScriptString(record.preinstall),
    install: getScriptString(record.install),
    postinstall: getScriptString(record.postinstall),
  };
};
