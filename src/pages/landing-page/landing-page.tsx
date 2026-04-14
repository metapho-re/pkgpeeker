import "./landing-page.css";

import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "wouter";

import { PackageIcon, StatusIndicator } from "../../components";
import { useAppStore } from "../../store";
import { withViewTransition } from "../../utils";
import {
  createLocation,
  getPackagesFromPath,
  parseLocation,
} from "../../views";

interface Props {
  autoInstall?: boolean;
}

export const LandingPage = ({ autoInstall = false }: Props) => {
  const appState = useAppStore((state) => state.appState);
  const isLoading = useAppStore((state) => state.isLoading);
  const hasError = useAppStore((state) => state.hasError);
  const installPackages = useAppStore((state) => state.installPackages);
  const reset = useAppStore((state) => state.reset);
  const [initialPackages] = useState(() =>
    autoInstall ? getPackagesFromPath(window.location.pathname) : "",
  );
  const [userInput, setUserInput] = useState(initialPackages);
  const hasAutoInstalled = useRef(false);
  const [location, navigate] = useLocation();

  const installAndNavigate = useCallback(
    async (input: string) => {
      if (!input) {
        return;
      }

      const packageList = input.split(" ");
      const packagesSegment = encodeURIComponent(packageList.join(","));
      const { view } = parseLocation(location);

      await installPackages(packageList);

      withViewTransition(() => {
        navigate(createLocation(packagesSegment, view));
      });
    },
    [location, installPackages, navigate],
  );

  useEffect(() => {
    if (
      autoInstall &&
      initialPackages &&
      appState === "ready" &&
      !hasAutoInstalled.current
    ) {
      hasAutoInstalled.current = true;
      installAndNavigate(initialPackages);
    }
  }, [autoInstall, initialPackages, appState, installAndNavigate]);

  const handlePackagesInstallationOnEnter: KeyboardEventHandler<
    HTMLInputElement
  > = (event) => {
    if (event.key === "Enter") {
      installAndNavigate(userInput);
    }
  };

  const handleUserInputChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setUserInput(event.target.value);
  };

  const handleReset = useCallback(() => {
    setUserInput("");
    reset();
    navigate("/");
  }, [reset, navigate]);

  const canInstall = !(isLoading || hasError || appState === "done");

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
          placeholder="Try any npm package(s)..."
          disabled={!canInstall}
          value={userInput}
          onChange={handleUserInputChange}
          onKeyDown={handlePackagesInstallationOnEnter}
        />
        {hasError ? (
          <button className="form__button" onClick={handleReset}>
            Reset
          </button>
        ) : (
          <button
            className="form__button"
            disabled={!canInstall || userInput.length === 0}
            onClick={() => installAndNavigate(userInput)}
          >
            Peek
          </button>
        )}
      </div>
      <StatusIndicator appState={appState} hasError={hasError} />
    </div>
  );
};
