import { WebContainer } from "@webcontainer/api";

const nestedDependencyRegExp =
  /node_modules\/.*\/node_modules\/.*[\r\n]+([^\r\n]+)/g;
const pathVersionRegExp = /([^"]*).*\n.*"([0-9]*\.[0-9]*\.[0-9]*)/;

export const getNestedDependencyPaths = async (
  webContainerInstance: WebContainer | undefined
): Promise<Record<string, string> | null> => {
  let packageLockJson: string | undefined;

  try {
    packageLockJson = await webContainerInstance?.fs.readFile(
      "./package-lock.json",
      "utf-8"
    );
  } catch (_) {
    // fail silently
  }

  if (!packageLockJson) {
    return null;
  }

  const nestedDependencyStrings = [
    ...packageLockJson.matchAll(nestedDependencyRegExp),
  ].map((match) => match[0]);

  const nestedDependencyPaths: Record<string, string> = {};

  nestedDependencyStrings.forEach((nestedDependencyString) => {
    const [, path, version] =
      nestedDependencyString.match(pathVersionRegExp) || [];

    if (version && path) {
      const packageName = path.split("/").pop();

      nestedDependencyPaths[`${packageName}@${version}`] = path;
    }
  });

  return nestedDependencyPaths;
};
