import type { ModuleFormat } from "../../types";

import { BaseTag } from "./base-tag";

interface Props {
  moduleFormat: ModuleFormat;
}

const labels: Record<ModuleFormat, string> = {
  esm: "ESM",
  cjs: "CJS",
  dual: "ESM + CJS",
};

const tooltips: Record<ModuleFormat, string> = {
  esm: "This package uses ECMAScript Modules (ESM).",
  cjs: "This package uses CommonJS (CJS).",
  dual: "This package supports both ESM and CommonJS.",
};

export const ModuleFormatTag = ({ moduleFormat }: Props) => (
  <BaseTag type="module-format" title={tooltips[moduleFormat]}>
    {labels[moduleFormat]}
  </BaseTag>
);
