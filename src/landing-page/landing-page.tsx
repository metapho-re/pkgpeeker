import "./landing-page.css";

import { WebContainer } from "@webcontainer/api";
import { useEffect } from "react";

import { PackageIcon, StatusIndicator } from "../components";
import { DependencyTreeData } from "../types";

import { useUserInput } from "./use-user-input";

interface Props {
  dependencyTreeData: DependencyTreeData | null;
  onDataGenerated: (data: DependencyTreeData | null) => void;
  onWebContainerReady: (instance: WebContainer) => void;
}

export const LandingPage = ({
  dependencyTreeData,
  onDataGenerated,
  onWebContainerReady,
}: Props) => {
  const {
    appState,
    hasError,
    isLoading,
    shouldAutoInstall,
    userInput,
    webContainerInstance,
    handlePackagesInstallation,
    handlePackagesInstallationOnEnter,
    handleReset,
    handleUserInputChange,
  } = useUserInput(onDataGenerated);

  useEffect(() => {
    if (webContainerInstance) {
      onWebContainerReady(webContainerInstance);
    }
  }, [webContainerInstance, onWebContainerReady]);

  useEffect(() => {
    if (shouldAutoInstall && appState === "ready") {
      handlePackagesInstallation();
    }
  }, [shouldAutoInstall, appState, handlePackagesInstallation]);

  const canInstall = !(isLoading || hasError || appState === "done");
  const canReset = hasError || dependencyTreeData !== null;

  return (
    <div className="landing-page">
      <div className="titles-container">
        <PackageIcon />
        <h1 className="primary-title">pkgpeeker.dev</h1>
        <h2 className="secondary-title">
          Peek inside npm packages — no install required.
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
