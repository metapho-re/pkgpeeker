import "./file-viewer.css";

import { WebContainer } from "@webcontainer/api";
import { useEffect, useRef, useState } from "react";
import { type ThemedToken } from "shiki/core";

import {
  getFormattedSize,
  getHighlighter,
  getLanguageFromPath,
} from "../../utils";

const MAX_FILE_SIZE = 100 * 1024;

const createPlainTokens = (content: string): ThemedToken[][] =>
  content.split("\n").map((line) => [{ content: line } as ThemedToken]);

const isBinaryContent = (bytes: Uint8Array): boolean => {
  const limit = Math.min(bytes.length, 512);

  for (let i = 0; i < limit; i++) {
    if (bytes[i] === 0x00) {
      return true;
    }
  }

  return false;
};

interface FileState {
  content: string | null;
  fileSize: number;
  isBinary: boolean;
  isLoading: boolean;
  isTruncated: boolean;
  tokens: ThemedToken[][];
}

const INITIAL_STATE: FileState = {
  content: null,
  fileSize: 0,
  isBinary: false,
  isLoading: true,
  isTruncated: false,
  tokens: [],
};

interface Props {
  filePath: string;
  webContainerInstance: WebContainer;
}

export const FileViewer = ({ filePath, webContainerInstance }: Props) => {
  const [state, setState] = useState<FileState>(INITIAL_STATE);
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    ref.current?.scrollTo(0, 0);
  }, [filePath]);

  useEffect(() => {
    let isCancelled = false;

    webContainerInstance.fs
      .readFile(filePath)
      .then(async (bytes) => {
        if (isCancelled) {
          return;
        }

        if (bytes.byteLength === 0) {
          setState({ ...INITIAL_STATE, isLoading: false });

          return;
        }

        if (isBinaryContent(bytes)) {
          setState({
            ...INITIAL_STATE,
            fileSize: bytes.byteLength,
            isBinary: true,
            isLoading: false,
          });

          return;
        }

        const isTruncated = bytes.byteLength > MAX_FILE_SIZE;
        const slice = isTruncated ? bytes.slice(0, MAX_FILE_SIZE) : bytes;
        const decoder = new TextDecoder();
        const content = decoder.decode(slice);
        const language = getLanguageFromPath(filePath);

        let tokens: ThemedToken[][];

        if (language) {
          try {
            const highlighter = await getHighlighter();

            tokens = highlighter.codeToTokens(content, {
              lang: language,
              theme: "kanagawa-wave",
            }).tokens;
          } catch {
            tokens = createPlainTokens(content);
          }
        } else {
          tokens = createPlainTokens(content);
        }

        if (isCancelled) {
          return;
        }

        setState({
          content,
          fileSize: bytes.byteLength,
          isBinary: false,
          isLoading: false,
          isTruncated,
          tokens,
        });
      })
      .catch(() => {
        if (!isCancelled) {
          setState({ ...INITIAL_STATE, isLoading: false });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [filePath, webContainerInstance]);

  const fileName = filePath.split("/").pop() || filePath;

  if (state.isLoading) {
    return (
      <div className="file-viewer">
        <div className="file-viewer__header">{fileName}</div>
        <div className="file-viewer__message">Loading...</div>
      </div>
    );
  }

  if (state.isBinary) {
    return (
      <div className="file-viewer">
        <div className="file-viewer__header">{fileName}</div>
        <div className="file-viewer__message">
          Binary file — {getFormattedSize(state.fileSize)}
        </div>
      </div>
    );
  }

  if (state.content === null || state.fileSize === 0) {
    return (
      <div className="file-viewer">
        <div className="file-viewer__header">{fileName}</div>
        <div className="file-viewer__message">Empty file</div>
      </div>
    );
  }

  return (
    <div className="file-viewer">
      <div className="file-viewer__header">
        <span>{fileName}</span>
        <span className="file-viewer__size">
          {getFormattedSize(state.fileSize)}
        </span>
      </div>
      {state.isTruncated && (
        <div className="file-viewer__notice">
          File truncated — showing first {getFormattedSize(MAX_FILE_SIZE)} of{" "}
          {getFormattedSize(state.fileSize)}
        </div>
      )}
      <pre ref={ref} className="file-viewer__content">
        <code>
          {state.tokens.map((lineTokens, lineIndex) => (
            <span key={lineIndex} className="file-viewer__line">
              <span className="file-viewer__line-number">{lineIndex + 1}</span>
              {lineTokens.map((token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  style={token.color ? { color: token.color } : undefined}
                >
                  {token.content}
                </span>
              ))}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
};
