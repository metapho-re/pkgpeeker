import { DependencyTree } from "../../types";
import { getFormattedSize } from "../../utils";
import "./TreeNavigator.css";

interface Props {
  packageName: string;
  version: string;
  isDeduped: boolean;
  installationPath: string;
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
  installationPath,
  folderSizeInBytes,
  dependencies,
  depth,
  selectedPath,
  expandedPaths,
  onSelect,
  onToggleExpand,
}: Props) => {
  const hasChildren = Object.keys(dependencies).length > 0;
  const isExpanded = expandedPaths.has(installationPath);
  const isSelected = selectedPath === installationPath;

  const handleChevronClick = (event: React.MouseEvent) => {
    event.stopPropagation();

    onToggleExpand(installationPath);
  };

  return (
    <>
      <div
        className={`tree-node${isSelected ? " tree-node--selected" : ""}`}
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={() => onSelect(installationPath)}
        data-path={installationPath}
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
        Object.entries(dependencies).map(([name, packageInformation]) => (
          <TreeNode
            key={packageInformation.installationPath}
            packageName={name}
            version={packageInformation.version}
            isDeduped={packageInformation.isDeduped}
            installationPath={packageInformation.installationPath}
            folderSizeInBytes={
              packageInformation.folderStatistics?.folderSizeInBytes ?? 0
            }
            dependencies={packageInformation.dependencies}
            depth={depth + 1}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            onSelect={onSelect}
            onToggleExpand={onToggleExpand}
          />
        ))}
    </>
  );
};
