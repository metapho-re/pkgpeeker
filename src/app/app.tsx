import "./app.css";

import { useEffect } from "react";

import { Routes } from "../routes";
import { useAppStore } from "../store";

export const App = () => {
  const boot = useAppStore((state) => state.boot);

  useEffect(() => {
    boot();
  }, [boot]);

  return (
    <>
      <div className="small-screen-notice">
        <p>PkgPeeker requires a larger screen.</p>
        <p>Please visit on a desktop browser.</p>
      </div>
      <div className="app-content">
        <Routes />
      </div>
    </>
  );
};
