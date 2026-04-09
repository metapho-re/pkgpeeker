import { ModuleFormat } from "../types";

interface Params {
  type?: string;
  main?: string;
  module?: string;
  exports?: unknown;
}

const hasDualConditions = (value: object): boolean => {
  const keys = Object.keys(value);

  return keys.includes("import") && keys.includes("require");
};

const hasConditionalExports = (exports: unknown): boolean => {
  if (typeof exports !== "object" || exports === null) {
    return false;
  }

  // Support for top-level conditions: { "import": "...", "require": "..." }
  if (hasDualConditions(exports)) {
    return true;
  }

  // Support for subpath conditions: { ".": { "import": "...", "require": "..." } }
  return Object.values(exports).some(
    (value) =>
      typeof value === "object" && value !== null && hasDualConditions(value),
  );
};

export const parseModuleFormat = ({
  type,
  main,
  module,
  exports,
}: Params): ModuleFormat => {
  const isEsmType = type === "module";
  const hasCjsEntry = typeof main === "string" && main.endsWith(".cjs");
  const hasEsmEntry = typeof module === "string";
  const hasDualExports = hasConditionalExports(exports);

  if (
    hasDualExports ||
    (isEsmType && hasCjsEntry) ||
    (hasEsmEntry && !isEsmType)
  ) {
    return "dual";
  }

  if (isEsmType) {
    return "esm";
  }

  return "cjs";
};
