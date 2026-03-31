import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PackageDetail, TreeNavigator } from "./components";
import { LandingPage } from "./core";
import { DependencyTreeData } from "./types";
import {
  flattenDependencyTree,
  getInstallationPathByDependencyPath,
} from "./utils";
import "./App.css";

function App() {
  const [dependencyTreeData, setDependencyTreeData] =
    useState<DependencyTreeData | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const flatDependencyIndex = useMemo(() => {
    if (!dependencyTreeData) {
      return {};
    }

    return flattenDependencyTree(dependencyTreeData.dependencyTree);
  }, [dependencyTreeData]);

  const handleDataGeneration = (data: DependencyTreeData | null) => {
    setDependencyTreeData(data);

    if (data) {
      const topLevelPaths = new Set(
        Object.values(data.dependencyTree).map(
          ({ installationPath }) => installationPath,
        ),
      );

      setExpandedPaths(topLevelPaths);

      const firstEntry = Object.values(data.dependencyTree)[0];

      setSelectedPath(firstEntry?.installationPath ?? null);
    } else {
      setSelectedPath(null);
      setExpandedPaths(new Set());
    }
  };

  const handleSelect = useCallback(
    (path: string) => {
      setSelectedPath(path);

      const entry = flatDependencyIndex[path];

      if (entry) {
        setExpandedPaths((previousState) => {
          const nextState = new Set(previousState);

          for (let i = 1; i < entry.dependencyPath.length; i++) {
            const ancestorPath = entry.dependencyPath.slice(0, i);
            const installationPath = getInstallationPathByDependencyPath(
              ancestorPath,
              flatDependencyIndex,
            );

            if (installationPath) {
              nextState.add(installationPath);
            }
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

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dependencyTreeData && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dependencyTreeData]);

  const selectedEntry = selectedPath ? flatDependencyIndex[selectedPath] : null;

  return (
    <div>
      <LandingPage
        dependencyTreeData={dependencyTreeData}
        handleDataGeneration={handleDataGeneration}
      />
      {dependencyTreeData ? (
        <div className="content" ref={contentRef}>
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
                flatIndex={flatDependencyIndex}
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
      ) : null}
    </div>
  );
}

export default App;
