import { DependencyTree } from "../../types";
import { TreeNode } from "./TreeNode";
import "./TreeNavigator.css";

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
            installationPath,
            version,
            isDeduped,
            folderStatistics,
            dependencies,
          },
        ]) => (
          <TreeNode
            key={installationPath}
            packageName={packageName}
            version={version}
            isDeduped={isDeduped}
            installationPath={installationPath}
            folderSizeInBytes={folderStatistics?.folderSizeInBytes ?? 0}
            dependencies={dependencies}
            depth={0}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            onSelect={onSelect}
            onToggleExpand={onToggleExpand}
          />
        ),
      )}
    </div>
  );
};
