import "./app.css";

import { WebContainer } from "@webcontainer/api";
import { useEffect, useRef, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";

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
  const [webContainerInstance, setWebContainerInstance] =
    useState<WebContainer | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [dependencyTreeData]);

  return (
    <div>
      <LandingPage
        dependencyTreeData={dependencyTreeData}
        onDataGenerated={setDependencyTreeData}
        onWebContainerReady={setWebContainerInstance}
      />
      {dependencyTreeData ? (
        <div className="views-container" key={location} ref={ref}>
          <TabBar />
          <Switch>
            <Route path="/">
              <DependencyTreeView dependencyTreeData={dependencyTreeData} />
            </Route>
            <Route path="/files">
              <FileExplorerView
                dependencyTreeData={dependencyTreeData}
                webContainerInstance={webContainerInstance}
              />
            </Route>
            <Route path="/security">
              <SecurityInsightsView />
            </Route>
            <Redirect to="/" />
          </Switch>
        </div>
      ) : null}
    </div>
  );
}

export default App;
