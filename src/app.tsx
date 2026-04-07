import "./app.css";

import { useEffect, useRef, useState } from "react";
import { Route, useLocation } from "wouter";

import { TabBar } from "./components";
import { LandingPage } from "./landing-page";
import { DependencyTreeData } from "./types";
import {
  DependencyTreeView,
  FileExplorerView,
  SecurityInsightsView,
} from "./views";

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const [dependencyTreeData, setDependencyTreeData] =
    useState<DependencyTreeData | null>(null);

  const handleDataGeneration = (data: DependencyTreeData | null) => {
    setDependencyTreeData(data);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dependencyTreeData]);

  return (
    <div>
      <LandingPage
        dependencyTreeData={dependencyTreeData}
        handleDataGeneration={handleDataGeneration}
      />
      {dependencyTreeData ? (
        <div className="views-container" key={location} ref={ref}>
          <TabBar />
          <Route path="/">
            <DependencyTreeView dependencyTreeData={dependencyTreeData} />
          </Route>
          <Route path="/files">
            <FileExplorerView />
          </Route>
          <Route path="/security">
            <SecurityInsightsView />
          </Route>
        </div>
      ) : null}
    </div>
  );
}

export default App;
