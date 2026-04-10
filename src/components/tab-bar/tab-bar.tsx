import "./tab-bar.css";

import { useLocation } from "wouter";

import { createLocation, parseLocation, type View } from "../../views";

interface Tab {
  label: string;
  view: View;
}

const tabs: Tab[] = [
  { label: "Packages", view: "" },
  { label: "File Explorer", view: "files" },
  { label: "Security Insights", view: "security" },
];

export const TabBar = () => {
  const [location, setLocation] = useLocation();

  const { packages, view: currentView } = parseLocation(location);

  return (
    <nav className="tab-bar">
      {tabs.map(({ label, view }) => (
        <button
          key={view}
          className={`tab-bar__tab${view === currentView ? " tab-bar__tab--active" : ""}`}
          onClick={() => setLocation(createLocation(packages, view))}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};
