import "./app.css";

import { WebContainer } from "@webcontainer/api";
import { useEffect, useRef, useState } from "react";

import { LandingPage } from "./landing-page";
import { DependencyTreeData } from "./types";
import { Views } from "./views";

function App() {
  const ref = useRef<HTMLDivElement>(null);
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
        <Views
          ref={ref}
          dependencyTreeData={dependencyTreeData}
          webContainerInstance={webContainerInstance}
        />
      ) : null}
    </div>
  );
}

export default App;
