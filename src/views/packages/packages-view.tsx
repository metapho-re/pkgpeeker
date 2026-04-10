import "./packages-view.css";

import { useCallback } from "react";

import {
  PackageDetail,
  TreeNavigator,
  type TreeNavigatorState,
} from "../../components";
import { DependencyTreeData } from "../../types";

interface Props {
  dependencyTreeData: DependencyTreeData;
  treeNavigatorState: TreeNavigatorState;
}

export const PackagesView = ({
  dependencyTreeData,
  treeNavigatorState,
}: Props) => {
  const {
    expandedPaths,
    selectedEntry,
    selectedPath,
    selectPath,
    toggleExpand,
  } = treeNavigatorState;

  const handleSelect = useCallback<(path: string) => void>(
    (path: string) => {
      selectPath(path);

      requestAnimationFrame(() => {
        const node = document.querySelector(
          `[data-path="${CSS.escape(path)}"]`,
        );

        node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    },
    [selectPath],
  );

  return (
    <div className="packages-view">
      <div className="master-detail-layout">
        <TreeNavigator
          dependencyTree={dependencyTreeData.dependencyTree}
          selectedPath={selectedPath}
          expandedPaths={expandedPaths}
          onSelect={handleSelect}
          onToggleExpand={toggleExpand}
        />
        {selectedEntry ? (
          <PackageDetail
            packageName={selectedEntry.packageName}
            packageInformation={selectedEntry}
            onNavigate={handleSelect}
          />
        ) : (
          <div className="package-detail">
            <div className="package-detail__empty">
              Select a package from the tree to view details
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
