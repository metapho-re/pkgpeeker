import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { AppState, DependencyTreeData } from "../types";
import { useWebContainer } from "./useWebContainer";

export const useUserInput = (
  handleDataGeneration: (data: DependencyTreeData | null) => void
): {
  appState: AppState;
  hasError: boolean;
  isLoading: boolean;
  userInput: string;
  handlePackagesInstallation: () => Promise<void>;
  handlePackagesInstallationOnEnter: KeyboardEventHandler<HTMLInputElement>;
  handleReset: () => void;
  handleUserInputChange: ChangeEventHandler<HTMLInputElement>;
} => {
  const [userInput, setUserInput] = useState("");
  const { appState, hasError, isLoading, reset, spawnMainProcess } =
    useWebContainer();

  const handlePackagesInstallation = async () => {
    if (!userInput) {
      return;
    }

    const packageList = userInput.split(" ");

    handleDataGeneration(await spawnMainProcess(packageList));

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
    handleDataGeneration(null);
    reset();
  };

  const handleUserInputChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setUserInput(event.target.value);
  };

  return {
    appState,
    hasError,
    isLoading,
    userInput,
    handlePackagesInstallation,
    handlePackagesInstallationOnEnter,
    handleReset,
    handleUserInputChange,
  };
};
