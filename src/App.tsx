import { useState } from "react";
import { Footer, PackageCard } from "./components";
import { LandingPage } from "./core";
import { DependencyTreeData } from "./types";
import "./App.css";

function App() {
  const [dependencyTreeData, setDependencyTreeData] =
    useState<DependencyTreeData | null>(null);

  const handleDataGeneration = (data: DependencyTreeData | null) => {
    setDependencyTreeData(data);
  };

  return (
    <div>
      <LandingPage
        dependencyTreeData={dependencyTreeData}
        handleDataGeneration={handleDataGeneration}
      />
      {dependencyTreeData ? (
        <div className="content">
          <div className="dependency-tree">
            {Object.entries(dependencyTreeData.dependencyTree).map(
              ([key, value]) => (
                <PackageCard
                  key={crypto.randomUUID()}
                  packageName={key}
                  maxDepth={dependencyTreeData.maxDepth}
                  {...value}
                />
              )
            )}
          </div>
          <Footer />
        </div>
      ) : null}
    </div>
  );
}

export default App;
