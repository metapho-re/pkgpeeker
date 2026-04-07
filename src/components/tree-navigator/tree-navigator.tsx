import "./tree-navigator.css";

import { DependencyTree } from "../../types";
import { getTreePath } from "../../utils";

import { TreeNode } from "./tree-node";

interface Props {
  dependencyTree: DependencyTree;
  selectedPath: string | null;
  expandedPaths: Set<string>;
  onSelect: (path: string) => void;
  onToggleExpand: (path: string) => void;
}

export const TreeNavigator = ({
  dependencyTree,
  selectedPath,
  expandedPaths,
  onSelect,
  onToggleExpand,
}: Props) => {
  return (
    <div className="tree-navigator">
      {Object.entries(dependencyTree).map(
        ([
          packageName,
          {
            version,
            isDeduped,
            dependencyPath,
            folderStatistics,
            dependencies,
          },
        ]) => {
          const treePath = getTreePath(dependencyPath);

          return (
            <TreeNode
              key={treePath}
              packageName={packageName}
              version={version}
              isDeduped={isDeduped}
              treePath={treePath}
              folderSizeInBytes={folderStatistics?.folderSizeInBytes ?? 0}
              dependencies={dependencies}
              depth={0}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
            />
          );
        },
      )}
    </div>
  );
};
