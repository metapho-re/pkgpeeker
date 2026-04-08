import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      langs: [
        import("shiki/langs/css.mjs"),
        import("shiki/langs/html.mjs"),
        import("shiki/langs/javascript.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/jsx.mjs"),
        import("shiki/langs/less.mjs"),
        import("shiki/langs/markdown.mjs"),
        import("shiki/langs/scss.mjs"),
        import("shiki/langs/shell.mjs"),
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/yaml.mjs"),
      ],
      themes: [import("shiki/themes/kanagawa-wave.mjs")],
    });
  }

  return highlighterPromise;
}

const EXTENSION_TO_LANGUAGE_MAP: Record<string, string> = {
  ".bash": "shell",
  ".css": "css",
  ".htm": "html",
  ".html": "html",
  ".js": "javascript",
  ".json": "json",
  ".jsx": "jsx",
  ".less": "less",
  ".map": "json",
  ".md": "markdown",
  ".scss": "scss",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".mts": "typescript",
  ".cts": "typescript",
  ".sh": "shell",
  ".ts": "typescript",
  ".tsx": "tsx",
  ".yaml": "yaml",
  ".yml": "yaml",
};

export function getLanguageFromPath(filePath: string): string | null {
  const extension = filePath.match(/\.[^.]+$/)?.[0]?.toLowerCase();

  if (!extension) {
    return null;
  }

  return EXTENSION_TO_LANGUAGE_MAP[extension] ?? null;
}
