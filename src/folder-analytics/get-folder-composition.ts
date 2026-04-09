import { DirEnt, WebContainer } from "@webcontainer/api";

import { FileDetails } from "../types";
import { getExtension } from "../utils";

interface Params {
  webContainerInstance: WebContainer | undefined;
  installationPath: string;
}

export const getFolderComposition = async ({
  webContainerInstance,
  installationPath,
}: Params): Promise<FileDetails[]> => {
  const folderContentList: DirEnt<string>[] = [];

  try {
    folderContentList.push(
      ...((await webContainerInstance?.fs.readdir(installationPath, {
        withFileTypes: true,
      })) || []),
    );
  } catch (_) {
    // fail silently
  }

  return (
    await Promise.all(
      folderContentList.map(async (listItem) => {
        if (listItem.isDirectory()) {
          return await getFolderComposition({
            webContainerInstance,
            installationPath: `${installationPath}/${listItem.name}`,
          });
        } else {
          const fileContent = await webContainerInstance?.fs.readFile(
            `${installationPath}/${listItem.name}`,
          );

          return await Promise.resolve({
            extension: getExtension(listItem.name),
            sizeInBytes: fileContent?.byteLength || 0,
          });
        }
      }),
    )
  ).flat();
};
