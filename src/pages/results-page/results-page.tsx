import "./results-page.css";

import { useAppStore } from "../../store";
import { Views } from "../../views";

import { LandingPage } from "../landing-page";

export const ResultsPage = () => {
  const dependencyTreeData = useAppStore((state) => state.dependencyTreeData);

  if (!dependencyTreeData) {
    return <LandingPage autoInstall />;
  }

  return (
    <div className="results-page">
      <div className="results-page__content">
        <Views dependencyTreeData={dependencyTreeData} />
      </div>
    </div>
  );
};
