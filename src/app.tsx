import "./app.css";

import { useEffect } from "react";

import { Routes } from "./routes";
import { useAppStore } from "./store";

function App() {
  const boot = useAppStore((state) => state.boot);

  useEffect(() => {
    boot();
  }, [boot]);

  return <Routes />;
}

export default App;
