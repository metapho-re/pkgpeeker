import type { WebContainer } from "@webcontainer/api";

import type { FileTreeEntry } from "./file-tree-node";

export const readDirectory = async (
  webContainerInstance: WebContainer,
  path: string,
): Promise<FileTreeEntry[]> => {
  const entries = await webContainerInstance.fs.readdir(path, {
    withFileTypes: true,
  });

  const fileTreeEntries: FileTreeEntry[] = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = `${path}/${entry.name}`;
      const isDirectory = entry.isDirectory();

      let sizeInBytes: number | undefined;

      if (!isDirectory) {
        try {
          sizeInBytes = (await webContainerInstance.fs.readFile(fullPath))
            .byteLength;
        } catch {
          sizeInBytes = 0;
        }
      }

      return { name: entry.name, path: fullPath, isDirectory, sizeInBytes };
    }),
  );

  return fileTreeEntries.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) {
      return a.isDirectory ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
};
