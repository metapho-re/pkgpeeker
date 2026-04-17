import "./landing-page.css";

import {
  type ChangeEventHandler,
  type DragEventHandler,
  type KeyboardEventHandler,
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

import { parseDependenciesFromPackageJson } from "./parse-dependencies-from-package-json";

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
  const [isDragging, setIsDragging] = useState(false);
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

  const handleReset = () => {
    setUserInput("");
    reset();
    navigate("/");
  };

  const handleDragEnter: DragEventHandler = (event) => {
    event.preventDefault();

    if (canInstall) {
      setIsDragging(true);
    }
  };

  const handleDragOver: DragEventHandler = (event) => {
    event.preventDefault();
  };

  const handleDragLeave: DragEventHandler = (event) => {
    event.preventDefault();

    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop: DragEventHandler = async (event) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    if (!file || file.name !== "package.json") {
      return;
    }

    try {
      const content = await file.text();
      const packages = parseDependenciesFromPackageJson(content);

      if (packages.length === 0) {
        return;
      }

      const input = packages.join(" ");

      setUserInput(input);
      installAndNavigate(input);
    } catch {
      // fail silently
    }
  };

  const canInstall = !(isLoading || hasError || appState === "done");

  return (
    <div className="landing-page" onDragEnter={handleDragEnter}>
      {isDragging && (
        <div
          className="drop-overlay"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="drop-overlay__content">
            Drop your package.json here.
          </div>
        </div>
      )}
      <div className="titles-container">
        <PackageIcon />
        <h1 className="primary-title">pkgpeeker.dev</h1>
        <h2 className="secondary-title">
          Peek inside npm packages — no install required.
        </h2>
      </div>
      <div className="form-container">
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
        <p className="drop-hint">or drop a package.json here.</p>
      </div>
      <StatusIndicator appState={appState} hasError={hasError} />
    </div>
  );
};
