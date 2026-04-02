import { useEffect, useMemo, useState } from "react";
import { Marked } from "marked";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import "./readme-section.css";

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      langs: [
        import("shiki/langs/bash.mjs"),
        import("shiki/langs/css.mjs"),
        import("shiki/langs/javascript.mjs"),
        import("shiki/langs/json.mjs"),
        import("shiki/langs/shell.mjs"),
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/html.mjs"),
        import("shiki/langs/yaml.mjs"),
      ],
      themes: [import("shiki/themes/kanagawa-wave.mjs")],
    });
  }

  return highlighterPromise;
}

function createMarked(highlighter: HighlighterCore) {
  return new Marked({
    renderer: {
      code({ text, lang }) {
        const language =
          lang && highlighter.getLoadedLanguages().includes(lang)
            ? lang
            : "text";

        return highlighter.codeToHtml(text, {
          lang: language,
          theme: "kanagawa-wave",
        });
      },
    },
  });
}

interface Props {
  readme: string;
}

export const ReadmeSection = ({ readme }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null);

  useEffect(() => {
    getHighlighter().then(setHighlighter);
  }, []);

  const html = useMemo(() => {
    if (!highlighter) {
      return null;
    }

    const marked = createMarked(highlighter);

    return marked.parse(readme) as string;
  }, [readme, highlighter]);

  return (
    <div className="detail-section">
      <button
        className="detail-section__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="detail-section__header">Readme</p>
        <span className="detail-section__chevron" data-expanded={isExpanded}>
          &#9662;
        </span>
      </button>
      {isExpanded && (
        <div
          className="readme-content"
          dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
      )}
    </div>
  );
};
