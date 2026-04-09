import "./readme-section.css";

import { Lexer, Marked, type Tokens } from "marked";
import { useEffect, useMemo, useState } from "react";
import { type HighlighterCore } from "shiki/core";

import { getHighlighter, loadLanguages } from "../../utils";

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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null);

  useEffect(() => {
    const tokens = new Lexer().lex(readme);
    const languages = tokens
      .filter(
        (token): token is Tokens.Code => token.type === "code" && !!token.lang,
      )
      .map((token) => token.lang!.split(/\s/)[0]);

    getHighlighter().then(async (highlighter) => {
      await loadLanguages(highlighter, languages);

      setHighlighter(highlighter);
    });
  }, [readme]);

  const html = useMemo<string | null>(() => {
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
