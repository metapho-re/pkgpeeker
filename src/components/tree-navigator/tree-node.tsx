import "./tree-navigator.css";

import type { DependencyTree } from "../../types";
import { getFormattedSize, getTreePath } from "../../utils";

interface Props {
  packageName: string;
  version: string;
  isDeduped: boolean;
  treePath: string;
  folderSizeInBytes: number;
  dependencies: DependencyTree;
  depth: number;
  selectedPath: string | null;
  expandedPaths: Set<string>;
  onSelect: (path: string) => void;
  onToggleExpand: (path: string) => void;
}

export const TreeNode = ({
  packageName,
  version,
  isDeduped,
  treePath,
  folderSizeInBytes,
  dependencies,
  depth,
  selectedPath,
  expandedPaths,
  onSelect,
  onToggleExpand,
}: Props) => {
  const hasChildren = Object.keys(dependencies).length > 0;
  const isExpanded = expandedPaths.has(treePath);
  const isSelected = selectedPath === treePath;

  const handleChevronClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onToggleExpand(treePath);
  };

  return (
    <>
      <div
        className={`tree-node${isSelected ? " tree-node--selected" : ""}`}
        style={{ paddingLeft: `${16 + depth * 16}px` }}
        onClick={() => onSelect(treePath)}
        data-path={treePath}
      >
        <span className="tree-node__content">
          <span
            className={`tree-node__chevron${hasChildren ? "" : " tree-node__chevron--hidden"}`}
            onClick={handleChevronClick}
          >
            {hasChildren ? (isExpanded ? "\u25BE" : "\u25B8") : ""}
          </span>
          <span className="tree-node__name">{packageName}</span>
          <span className="tree-node__version">{version}</span>
          {isDeduped && (
            <span className="tree-node__badge tree-node__badge--deduped">
              deduped
            </span>
          )}
          {folderSizeInBytes > 0 && (
            <span className="tree-node__badge">
              {getFormattedSize(folderSizeInBytes)}
            </span>
          )}
        </span>
      </div>
      {isExpanded &&
        Object.entries(dependencies).map(
          ([
            name,
            {
              version,
              isDeduped,
              dependencyPath,
              folderStatistics,
              dependencies,
            },
          ]) => {
            const childTreePath = getTreePath(dependencyPath);

            return (
              <TreeNode
                key={childTreePath}
                packageName={name}
                version={version}
                isDeduped={isDeduped}
                treePath={childTreePath}
                folderSizeInBytes={folderStatistics?.folderSizeInBytes ?? 0}
                dependencies={dependencies}
                depth={depth + 1}
                selectedPath={selectedPath}
                expandedPaths={expandedPaths}
                onSelect={onSelect}
                onToggleExpand={onToggleExpand}
              />
            );
          },
        )}
    </>
  );
};
