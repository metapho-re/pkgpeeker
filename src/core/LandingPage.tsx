import { PackageIcon, StatusIndicator } from "../components";
import { DependencyTreeData } from "../types";
import { useUserInput } from "./useUserInput";
import "./LandingPage.css";

interface Props {
  dependencyTreeData: DependencyTreeData | null;
  handleDataGeneration: (data: DependencyTreeData | null) => void;
}

export const LandingPage = ({
  dependencyTreeData,
  handleDataGeneration,
}: Props) => {
  const {
    appState,
    hasError,
    isLoading,
    userInput,
    handlePackagesInstallation,
    handlePackagesInstallationOnEnter,
    handleReset,
    handleUserInputChange,
  } = useUserInput(handleDataGeneration);

  const canInstall = !(isLoading || hasError || appState === "done");
  const canReset = hasError || dependencyTreeData !== null;

  return (
    <div className="landing-page">
      <div className="titles-container">
        <PackageIcon />
        <h1 className="primary-title">pkgpeeker.dev</h1>
        <h2 className="secondary-title">
          Get accurate insight into npm packages structure.
        </h2>
      </div>
      <div className="form">
        <input
          className="form__input"
          placeholder="Try any npm package..."
          disabled={!canInstall}
          value={userInput}
          onChange={handleUserInputChange}
          onKeyDown={handlePackagesInstallationOnEnter}
        />
        {!canReset ? (
          <button
            className="form__button"
            disabled={!canInstall || userInput.length === 0}
            onClick={handlePackagesInstallation}
          >
            Peek
          </button>
        ) : null}
        {canReset ? (
          <button className="form__button" onClick={handleReset}>
            Reset
          </button>
        ) : null}
      </div>
      <StatusIndicator appState={appState} hasError={hasError} />
    </div>
  );
};
