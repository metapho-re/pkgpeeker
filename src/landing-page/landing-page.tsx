import "./landing-page.css";

import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation } from "wouter";

import { PackageIcon, StatusIndicator } from "../components";
import { useAppStore } from "../store";
import { createLocation, getPackagesFromPath, parseLocation } from "../views";

export const LandingPage = () => {
  const [location, navigate] = useLocation();

  const appState = useAppStore((state) => state.appState);
  const isLoading = useAppStore((state) => state.isLoading);
  const hasError = useAppStore((state) => state.hasError);
  const dependencyTreeData = useAppStore((state) => state.dependencyTreeData);
  const installPackages = useAppStore((state) => state.installPackages);
  const reset = useAppStore((state) => state.reset);

  const [initialPackages] = useState(() =>
    getPackagesFromPath(window.location.pathname),
  );
  const shouldAutoInstall = initialPackages.length > 0;

  const [userInput, setUserInput] = useState(
    shouldAutoInstall ? initialPackages : "",
  );

  const installAndNavigate = useCallback(
    async (packages: string) => {
      const packageList = packages.split(" ");
      const packagesSegment = encodeURIComponent(packageList.join(","));
      const { view } = parseLocation(location);

      await installPackages(packageList);

      navigate(createLocation(packagesSegment, view));
    },
    [location, installPackages, navigate],
  );

  useEffect(() => {
    if (shouldAutoInstall && appState === "ready") {
      installAndNavigate(initialPackages);
    }
  }, [shouldAutoInstall, appState, initialPackages, installAndNavigate]);

  const handlePackagesInstallation = async () => {
    if (!userInput) {
      return;
    }

    await installAndNavigate(userInput);
  };

  const handlePackagesInstallationOnEnter: KeyboardEventHandler<
    HTMLInputElement
  > = (event) => {
    if (event.key === "Enter") {
      handlePackagesInstallation();
    }
  };

  const handleUserInputChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setUserInput(event.target.value);
  };

  const handleReset = async () => {
    await reset();

    setUserInput("");
    navigate("/");
  };

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
        {canReset ? (
          <button className="form__button" onClick={handleReset}>
            Reset
          </button>
        ) : (
          <button
            className="form__button"
            disabled={!canInstall || userInput.length === 0}
            onClick={handlePackagesInstallation}
          >
            Peek
          </button>
        )}
      </div>
      <StatusIndicator appState={appState} hasError={hasError} />
    </div>
  );
};
