import { WebContainer } from "@webcontainer/api";
import { useEffect, useRef, useState } from "react";
import { getDependencyTreeData } from "../dependency-tree";
import { AppState, DependencyTreeData, NpmDependencyTree } from "../types";

const npmListAllJsonRegExp = /{(?:.*|\r\n)*}/;

export const useWebContainer = (): {
  appState: AppState;
  hasError: boolean;
  isLoading: boolean;
  reset: () => Promise<void>;
  spawnMainProcess: (
    packageList: string[]
  ) => Promise<DependencyTreeData | null>;
} => {
  const hasBooted = useRef<boolean>(false);
  const [appState, setAppState] = useState<AppState>("idle");
  const [hasError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [webContainerInstance, setWebContainerInstance] =
    useState<WebContainer>();

  useEffect(() => {
    (async function bootWebContainer() {
      if (!hasBooted.current) {
        hasBooted.current = true;

        setAppState("booting");
        setLoading(true);
        setWebContainerInstance(await WebContainer.boot());
        setAppState("ready");
        setLoading(false);
      }
    })();
  }, []);

  const returnWithError = () => {
    setAppState("done");
    setError(true);
    setLoading(false);

    return null;
  };

  const reset = async () => {
    setAppState("ready");
    setError(false);
    setLoading(true);

    try {
      await webContainerInstance?.fs.rm("package.json");
      await webContainerInstance?.fs.rm("package-lock.json");
      await webContainerInstance?.fs.rm("node_modules", {
        force: true,
        recursive: true,
      });
    } catch (_) {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  const spawnCrunchingProcess = async () => {
    setAppState("crunching");

    const crunchingProcess = await webContainerInstance?.spawn("npm", [
      "list",
      "--all",
      "--json",
    ]);

    if (!crunchingProcess) {
      returnWithError();
    }

    let npmListAllJsonOutputString = "";

    crunchingProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          const matches = data.match(npmListAllJsonRegExp);

          if (matches && matches.length > 0) {
            npmListAllJsonOutputString = matches[0];
          }
        },
      })
    );

    await crunchingProcess?.exit;

    let npmDependencyTree: NpmDependencyTree = {};

    try {
      npmDependencyTree = JSON.parse(npmListAllJsonOutputString).dependencies;
    } catch (_) {
      returnWithError();
    }

    const dependencyTreeData = await getDependencyTreeData({
      webContainerInstance,
      npmDependencyTree,
    });

    setAppState("done");
    setLoading(false);

    return dependencyTreeData;
  };

  const spawnMainProcess = async (packageList: string[]) => {
    setAppState("installing");
    setLoading(true);

    const installationProcess = await webContainerInstance?.spawn("npm", [
      "install",
      ...packageList,
    ]);

    if (!installationProcess) {
      returnWithError();
    }

    if ((await installationProcess?.exit) !== 0) {
      returnWithError();
    }

    return await spawnCrunchingProcess();
  };

  return {
    appState,
    hasError,
    isLoading,
    reset,
    spawnMainProcess,
  };
};
