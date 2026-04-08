import "./file-viewer.css";

import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

import { getFormattedSize } from "../../utils";

const MAX_FILE_SIZE = 100 * 1024;

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
}

const INITIAL_STATE: FileState = {
  content: null,
  fileSize: 0,
  isBinary: false,
  isLoading: true,
  isTruncated: false,
};

interface Props {
  filePath: string;
  webContainerInstance: WebContainer;
}

export const FileViewer = ({ filePath, webContainerInstance }: Props) => {
  const [state, setState] = useState<FileState>(INITIAL_STATE);

  useEffect(() => {
    let isCancelled = false;

    webContainerInstance.fs
      .readFile(filePath)
      .then((bytes) => {
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

        setState({
          content: decoder.decode(slice),
          fileSize: bytes.byteLength,
          isBinary: false,
          isLoading: false,
          isTruncated,
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

  const lines = state.content.split("\n");

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
      <pre className="file-viewer__content">
        <code>
          {lines.map((line, index) => (
            <span key={index} className="file-viewer__line">
              <span className="file-viewer__line-number">{index + 1}</span>
              {line}
              {"\n"}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
};
