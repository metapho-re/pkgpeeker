import "./file-tree-node.css";

import type { WebContainer } from "@webcontainer/api";
import { useState } from "react";

import { getFormattedSize } from "../../utils";

import { FileTypeIcon } from "./file-type-icon";
import { readDirectory } from "./read-directory";

export interface FileTreeEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  sizeInBytes?: number;
}

interface Props {
  entry: FileTreeEntry;
  depth: number;
  selectedPath: string | null;
  webContainerInstance: WebContainer;
  onSelect: (path: string) => void;
}

export const FileTreeNode = ({
  entry,
  depth,
  selectedPath,
  webContainerInstance,
  onSelect,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [children, setChildren] = useState<FileTreeEntry[] | null>(null);

  const handleClick = async () => {
    if (entry.isDirectory) {
      if (!isExpanded && children === null) {
        const entries = await readDirectory(webContainerInstance, entry.path);

        setChildren(entries);
      }

      setIsExpanded((previousState) => !previousState);
    } else {
      onSelect(entry.path);
    }
  };

  const isSelected = selectedPath === entry.path;

  return (
    <>
      <div
        className={`file-tree-node${isSelected ? " file-tree-node--selected" : ""}`}
        style={{ paddingLeft: `${16 + depth * 16}px` }}
        onClick={handleClick}
      >
        <span className="file-tree-node__content">
          {entry.isDirectory && (
            <span className="file-tree-node__chevron">
              {isExpanded ? "\u25BE" : "\u25B8"}
            </span>
          )}
          <span className="file-tree-node__icon">
            <FileTypeIcon
              fileName={entry.name}
              isDirectory={entry.isDirectory}
              isExpanded={isExpanded}
            />
          </span>
          <span className="file-tree-node__name">{entry.name}</span>
          {entry.sizeInBytes !== undefined && entry.sizeInBytes > 0 && (
            <span className="file-tree-node__size">
              {getFormattedSize(entry.sizeInBytes)}
            </span>
          )}
        </span>
      </div>
      {isExpanded &&
        children?.map((child) => (
          <FileTreeNode
            key={child.path}
            entry={child}
            depth={depth + 1}
            selectedPath={selectedPath}
            webContainerInstance={webContainerInstance}
            onSelect={onSelect}
          />
        ))}
    </>
  );
};
