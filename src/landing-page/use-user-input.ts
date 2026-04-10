import { WebContainer } from "@webcontainer/api";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { useLocation } from "wouter";

import { AppState, DependencyTreeData } from "../types";
import { createLocation, getPackagesFromPath, parseLocation } from "../views";
import { useWebContainer } from "../web-container";

interface ReturnType {
  appState: AppState;
  hasError: boolean;
  isLoading: boolean;
  shouldAutoInstall: boolean;
  userInput: string;
  webContainerInstance: WebContainer | undefined;
  handlePackagesInstallation: () => Promise<void>;
  handlePackagesInstallationOnEnter: KeyboardEventHandler<HTMLInputElement>;
  handleReset: () => void;
  handleUserInputChange: ChangeEventHandler<HTMLInputElement>;
}

export const useUserInput = (
  onDataGenerated: (data: DependencyTreeData | null) => void,
): ReturnType => {
  const initialPackages = getPackagesFromPath(window.location.pathname);
  const [userInput, setUserInput] = useState<string>(initialPackages);
  const [location, navigate] = useLocation();
  const {
    appState,
    hasError,
    isLoading,
    webContainerInstance,
    reset,
    spawnMainProcess,
  } = useWebContainer();

  const handlePackagesInstallation = async () => {
    if (!userInput) {
      return;
    }

    const packageList = userInput.split(" ");
    const packagesSegment = encodeURIComponent(packageList.join(","));
    const { view } = parseLocation(location);

    navigate(createLocation(packagesSegment, view));
    onDataGenerated(await spawnMainProcess(packageList));

    setTimeout(() => {
      document
        .querySelector(".dependency-tree")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handlePackagesInstallationOnEnter: KeyboardEventHandler<
    HTMLInputElement
  > = (event) => {
    if (event.key === "Enter") {
      handlePackagesInstallation();
    }
  };

  const handleReset = () => {
    setUserInput("");
    onDataGenerated(null);
    navigate("/");
    reset();
  };

  const handleUserInputChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setUserInput(event.target.value);
  };

  const shouldAutoInstall = initialPackages.length > 0;

  return {
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
  };
};
