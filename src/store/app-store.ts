import { WebContainer } from "@webcontainer/api";
import { create } from "zustand";

import { getDependencyTreeData } from "../dependency-tree";
import { AppState, DependencyTreeData, NpmDependencyTree } from "../types";

const npmListAllJsonRegExp = /{(?:.*|\r\n)*}/;

let hasBooted = false;

interface AppStore {
  appState: AppState;
  isLoading: boolean;
  hasError: boolean;
  webContainerInstance: WebContainer | null;
  dependencyTreeData: DependencyTreeData | null;
  boot: () => Promise<void>;
  installPackages: (packageList: string[]) => Promise<void>;
  reset: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  appState: "idle",
  isLoading: false,
  hasError: false,
  webContainerInstance: null,
  dependencyTreeData: null,

  boot: async () => {
    if (hasBooted) {
      return;
    }

    hasBooted = true;

    set({ appState: "booting", isLoading: true });

    const webContainerInstance = await WebContainer.boot();

    set({ appState: "ready", isLoading: false, webContainerInstance });
  },

  installPackages: async (packageList: string[]) => {
    const { webContainerInstance } = get();

    set({ appState: "installing", isLoading: true, hasError: false });

    const installationProcess = await webContainerInstance?.spawn("npm", [
      "install",
      ...packageList,
    ]);

    if (!installationProcess || (await installationProcess.exit) !== 0) {
      set({ appState: "done", isLoading: false, hasError: true });

      return;
    }

    set({ appState: "crunching" });

    const crunchingProcess = await webContainerInstance?.spawn("npm", [
      "list",
      "--all",
      "--json",
    ]);

    if (!crunchingProcess) {
      set({ appState: "done", isLoading: false, hasError: true });

      return;
    }

    let npmListAllJsonOutputString = "";

    crunchingProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          const matches = data.match(npmListAllJsonRegExp);

          if (matches && matches.length > 0) {
            npmListAllJsonOutputString = matches[0];
          }
        },
      }),
    );

    await crunchingProcess.exit;

    let npmDependencyTree: NpmDependencyTree = {};

    try {
      npmDependencyTree = JSON.parse(npmListAllJsonOutputString).dependencies;
    } catch (_) {
      set({ appState: "done", isLoading: false, hasError: true });

      return;
    }

    const dependencyTreeData = await getDependencyTreeData({
      webContainerInstance,
      npmDependencyTree,
    });

    if (!dependencyTreeData) {
      set({ appState: "done", isLoading: false, hasError: true });

      return;
    }

    set({ appState: "done", isLoading: false, dependencyTreeData });
  },

  reset: async () => {
    const { webContainerInstance } = get();

    set({
      appState: "ready",
      isLoading: true,
      hasError: false,
      dependencyTreeData: null,
    });

    try {
      await Promise.all([
        webContainerInstance?.fs.rm("package.json"),
        webContainerInstance?.fs.rm("package-lock.json"),
        webContainerInstance?.fs.rm("node_modules", {
          force: true,
          recursive: true,
        }),
      ]);
    } catch (_) {
      // fail silently
    } finally {
      set({ isLoading: false });
    }
  },
}));
