import "./tab-bar.css";

import { useLocation } from "wouter";

interface Tab {
  label: string;
  path: string;
}

const tabs: Tab[] = [
  { label: "Dependency Tree", path: "/" },
  { label: "File Explorer", path: "/files" },
  { label: "Security Insights", path: "/security" },
];

export const TabBar = () => {
  const [location, setLocation] = useLocation();

  return (
    <nav className="tab-bar">
      {tabs.map(({ label, path }) => (
        <button
          key={path}
          className={`tab-bar__tab${location === path ? " tab-bar__tab--active" : ""}`}
          onClick={() => setLocation(path)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};
