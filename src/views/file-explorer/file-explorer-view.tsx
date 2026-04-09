import "./file-explorer-view.css";

import { WebContainer } from "@webcontainer/api";
import { useCallback, useState } from "react";

import {
  FileTree,
  FileViewer,
  TreeNavigator,
  type TreeNavigatorState,
} from "../../components";
import { DependencyTreeData } from "../../types";

interface Props {
  dependencyTreeData: DependencyTreeData;
  webContainerInstance: WebContainer | null;
  treeNavigatorState: TreeNavigatorState;
}

export const FileExplorerView = ({
  dependencyTreeData,
  webContainerInstance,
  treeNavigatorState,
}: Props) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  const {
    expandedPaths,
    selectedEntry,
    selectedPath,
    selectPath,
    toggleExpand,
  } = treeNavigatorState;

  const handleSelectPackage = useCallback<(path: string) => void>(
    (path: string) => {
      selectPath(path);
      setSelectedFilePath(null);
    },
    [selectPath],
  );

  if (!webContainerInstance) {
    return (
      <div className="file-explorer-view">
        <div className="file-explorer-view__empty">
          WebContainer not available
        </div>
      </div>
    );
  }

  return (
    <div className="file-explorer-view">
      <div className="master-detail-layout">
        <TreeNavigator
          dependencyTree={dependencyTreeData.dependencyTree}
          selectedPath={selectedPath}
          expandedPaths={expandedPaths}
          onSelect={handleSelectPackage}
          onToggleExpand={toggleExpand}
        />
        {selectedEntry ? (
          <div className="file-explorer-view__file-tree">
            <FileTree
              key={selectedPath}
              basePath={selectedEntry.installationPath}
              selectedPath={selectedFilePath}
              webContainerInstance={webContainerInstance}
              onSelect={setSelectedFilePath}
            />
          </div>
        ) : (
          <div className="file-explorer-view__empty">
            Select a package to browse its files.
          </div>
        )}
        <div className="file-explorer-view__file-viewer">
          {selectedFilePath ? (
            <FileViewer
              filePath={selectedFilePath}
              webContainerInstance={webContainerInstance}
            />
          ) : (
            <div className="file-explorer-view__empty">
              Select a file to view its contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
