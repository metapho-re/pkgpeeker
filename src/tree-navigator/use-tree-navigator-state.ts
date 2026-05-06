import { useCallback, useState } from "react";

import type {
  DependencyAnalysis,
  PackageInformation,
} from "../dependency-tree";
import { getTreePath } from "../shared";

const getInitialSelectedPath = (
  dependencyAnalysis: DependencyAnalysis,
): string | null => {
  const firstEntry = Object.values(dependencyAnalysis.dependencyTree)[0];

  return firstEntry ? getTreePath(firstEntry.dependencyPath) : null;
};

const getInitialExpandedPaths = (
  dependencyAnalysis: DependencyAnalysis,
): Set<string> =>
  new Set(
    Object.values(dependencyAnalysis.dependencyTree).map(({ dependencyPath }) =>
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
  dependencyAnalysis: DependencyAnalysis,
): TreeNavigatorState => {
  const [selectedPath, setSelectedPath] = useState<string | null>(() =>
    getInitialSelectedPath(dependencyAnalysis),
  );
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() =>
    getInitialExpandedPaths(dependencyAnalysis),
  );

  const selectPath = useCallback<(path: string) => void>(
    (path: string) => {
      setSelectedPath(path);

      const entry = dependencyAnalysis.flatIndex[path];

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
    [dependencyAnalysis.flatIndex],
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

  const selectedEntry = selectedPath
    ? dependencyAnalysis.flatIndex[selectedPath]
    : null;

  return {
    expandedPaths,
    selectedEntry,
    selectedPath,
    selectPath,
    toggleExpand,
  };
};
