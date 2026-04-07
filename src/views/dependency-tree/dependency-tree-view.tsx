import "./dependency-tree-view.css";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PackageDetail, TreeNavigator } from "../../components";
import { DependencyTreeData } from "../../types";
import { flattenDependencyTree, getTreePath } from "../../utils";

interface Props {
  dependencyTreeData: DependencyTreeData;
}

const getInitialSelectedPath = (dependencyTreeData: DependencyTreeData) => {
  const firstEntry = Object.values(dependencyTreeData.dependencyTree)[0];

  return firstEntry ? getTreePath(firstEntry.dependencyPath) : null;
};

const getInitialExpandedPaths = (dependencyTreeData: DependencyTreeData) =>
  new Set(
    Object.values(dependencyTreeData.dependencyTree).map(({ dependencyPath }) =>
      getTreePath(dependencyPath),
    ),
  );

export const DependencyTreeView = ({ dependencyTreeData }: Props) => {
  const [selectedPath, setSelectedPath] = useState(() =>
    getInitialSelectedPath(dependencyTreeData),
  );
  const [expandedPaths, setExpandedPaths] = useState(() =>
    getInitialExpandedPaths(dependencyTreeData),
  );

  useEffect(() => {
    setSelectedPath(getInitialSelectedPath(dependencyTreeData));
    setExpandedPaths(getInitialExpandedPaths(dependencyTreeData));
  }, [dependencyTreeData]);

  const flatDependencyIndex = useMemo(
    () => flattenDependencyTree(dependencyTreeData.dependencyTree),
    [dependencyTreeData],
  );

  const handleSelect = useCallback(
    (path: string) => {
      setSelectedPath(path);

      const entry = flatDependencyIndex[path];

      if (entry) {
        setExpandedPaths((previousState) => {
          const nextState = new Set(previousState);

          for (let i = 1; i < entry.dependencyPath.length; i++) {
            const ancestorPath = entry.dependencyPath.slice(0, i);

            nextState.add(getTreePath(ancestorPath));
          }

          return nextState;
        });
      }

      requestAnimationFrame(() => {
        const node = document.querySelector(
          `[data-path="${CSS.escape(path)}"]`,
        );

        node?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    },
    [flatDependencyIndex],
  );

  const handleToggleExpand = useCallback((path: string) => {
    setExpandedPaths((previousState) => {
      const nextState = new Set(previousState);

      if (nextState.has(path)) {
        nextState.delete(path);
      } else {
        nextState.add(path);
      }

      return nextState;
    });
  }, []);

  const selectedEntry = selectedPath ? flatDependencyIndex[selectedPath] : null;

  return (
    <div className="dependency-tree-view">
      <div className="master-detail-layout">
        <TreeNavigator
          dependencyTree={dependencyTreeData.dependencyTree}
          selectedPath={selectedPath}
          expandedPaths={expandedPaths}
          onSelect={handleSelect}
          onToggleExpand={handleToggleExpand}
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
