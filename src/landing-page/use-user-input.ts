import { WebContainer } from "@webcontainer/api";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";

import { AppState, DependencyTreeData } from "../types";
import { useWebContainer } from "../web-container";

interface ReturnType {
  appState: AppState;
  hasError: boolean;
  isLoading: boolean;
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
  const [userInput, setUserInput] = useState<string>("");
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
    reset();
  };

  const handleUserInputChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    setUserInput(event.target.value);
  };

  return {
    appState,
    hasError,
    isLoading,
    userInput,
    webContainerInstance,
    handlePackagesInstallation,
    handlePackagesInstallationOnEnter,
    handleReset,
    handleUserInputChange,
  };
};
