import "./app.css";

import { useEffect } from "react";

import { LandingPage } from "./landing-page";
import { useAppStore } from "./store";
import { Views } from "./views";

function App() {
  const dependencyTreeData = useAppStore((state) => state.dependencyTreeData);
  const boot = useAppStore((state) => state.boot);

  useEffect(() => {
    boot();
  }, [boot]);

  return (
    <div>
      <LandingPage />
      {dependencyTreeData ? (
        <Views dependencyTreeData={dependencyTreeData} />
      ) : null}
    </div>
  );
}

export default App;
