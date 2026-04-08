import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

import { FileTreeEntry, FileTreeNode } from "./file-tree-node";
import { readDirectory } from "./read-directory";

interface Props {
  basePath: string;
  selectedPath: string | null;
  webContainerInstance: WebContainer;
  onSelect: (path: string) => void;
}

export const FileTree = ({
  basePath,
  selectedPath,
  webContainerInstance,
  onSelect,
}: Props) => {
  const [entries, setEntries] = useState<FileTreeEntry[]>([]);

  useEffect(() => {
    let isCancelled = false;

    readDirectory(webContainerInstance, basePath)
      .then((entries) => {
        if (!isCancelled) {
          setEntries(entries);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setEntries([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [webContainerInstance, basePath]);

  return (
    <div className="file-tree">
      {entries.map((entry) => (
        <FileTreeNode
          key={entry.path}
          entry={entry}
          depth={0}
          selectedPath={selectedPath}
          webContainerInstance={webContainerInstance}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
