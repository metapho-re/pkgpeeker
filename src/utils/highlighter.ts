import { bundledLanguages } from "shiki";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import { getExtension } from "./get-extension";

let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      langs: [
        import("shiki/langs/css.mjs"),
        import("shiki/langs/javascript.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/markdown.mjs"),
        import("shiki/langs/shell.mjs"),
        import("shiki/langs/xml.mjs"),
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/yaml.mjs"),
      ],
      themes: [import("shiki/themes/kanagawa-wave.mjs")],
    });
  }

  return highlighterPromise;
}

export async function loadLanguages(
  highlighter: HighlighterCore,
  languages: string[],
) {
  const loadedLanguages = new Set(highlighter.getLoadedLanguages());
  const missingLanguages = languages.filter(
    (language) =>
      !loadedLanguages.has(language) && language in bundledLanguages,
  );

  if (missingLanguages.length > 0) {
    await highlighter.loadLanguage(
      ...missingLanguages.map(
        (language) =>
          bundledLanguages[language as keyof typeof bundledLanguages],
      ),
    );
  }
}

const EXTENSION_TO_LANGUAGE_MAP: Record<string, string> = {
  ".js": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".ts": "typescript",
  ".mts": "typescript",
  ".cts": "typescript",
  ".d.ts": "typescript",
  ".d.mts": "typescript",
  ".d.cts": "typescript",
  ".json": "json",
  ".css": "css",
  ".md": "markdown",
  ".markdown": "markdown",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".sh": "shell",
  ".bash": "shell",
  ".svg": "xml",
  ".map": "json",
};

export function getLanguageFromPath(filePath: string): string | null {
  const extension = getExtension(filePath);

  return EXTENSION_TO_LANGUAGE_MAP[extension] ?? null;
}
