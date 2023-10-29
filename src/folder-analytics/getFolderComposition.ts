import { DirEnt, WebContainer } from "@webcontainer/api";
import { FileDetails } from "../types";

interface Props {
  webContainerInstance: WebContainer | undefined;
  installationPath: string;
}

export const getFolderComposition = async ({
  webContainerInstance,
  installationPath,
}: Props): Promise<FileDetails[]> => {
  const folderContentList: DirEnt<string>[] = [];

  try {
    folderContentList.push(
      ...((await webContainerInstance?.fs.readdir(installationPath, {
        withFileTypes: true,
      })) || [])
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
          const fileNameParts = listItem.name.split(".");
          const fileContent = await webContainerInstance?.fs.readFile(
            `${installationPath}/${listItem.name}`
          );

          return await Promise.resolve({
            extension:
              fileNameParts.length > 1 && fileNameParts[0].length > 0
                ? `.${fileNameParts[fileNameParts.length - 1]}`
                : "no extension",
            sizeInBytes: fileContent?.byteLength || 0,
          });
        }
      })
    )
  ).flat();
};
