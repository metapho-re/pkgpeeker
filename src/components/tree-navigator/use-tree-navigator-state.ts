import { useCallback, useMemo, useState } from "react";

import { DependencyTreeData, PackageInformation } from "../../types";
import {
  type FlatDependencyIndex,
  flattenDependencyTree,
  getTreePath,
} from "../../utils";

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

export interface TreeNavigatorState {
  expandedPaths: Set<string>;
  selectedEntry: ({ packageName: string } & PackageInformation) | null;
  selectedPath: string | null;
  selectPath: (path: string) => void;
  toggleExpand: (path: string) => void;
}

export const useTreeNavigatorState = (
  dependencyTreeData: DependencyTreeData,
): TreeNavigatorState => {
  const [selectedPath, setSelectedPath] = useState<string | null>(() =>
    getInitialSelectedPath(dependencyTreeData),
  );
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() =>
    getInitialExpandedPaths(dependencyTreeData),
  );

  const flatDependencyIndex = useMemo<FlatDependencyIndex>(
    () => flattenDependencyTree(dependencyTreeData.dependencyTree),
    [dependencyTreeData],
  );

  const selectPath = useCallback<(path: string) => void>(
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
    },
    [flatDependencyIndex],
  );

  const toggleExpand = useCallback<(path: string) => void>((path: string) => {
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

  return {
    expandedPaths,
    selectedEntry,
    selectedPath,
    selectPath,
    toggleExpand,
  };
};
