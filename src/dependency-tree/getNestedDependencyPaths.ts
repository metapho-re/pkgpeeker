import { WebContainer } from "@webcontainer/api";
import { NestedDependencyPaths } from "../types";

const nestedDependencyRegExp = /node_modules\/.*\/node_modules\/.*/;
const endingSlashRegExp = /\/$/g;

interface PackageLockJson {
  packages: Record<string, { version: string }>;
}

export const getNestedDependencyPaths = async (
  webContainerInstance: WebContainer | undefined
): Promise<NestedDependencyPaths | null> => {
  let packageLockJson: PackageLockJson | undefined;

  try {
    packageLockJson = JSON.parse(
      (await webContainerInstance?.fs.readFile(
        "./package-lock.json",
        "utf-8"
      )) || ""
    );
  } catch (_) {
    // fail silently
  }

  if (!packageLockJson) {
    return null;
  }

  return Object.entries(packageLockJson.packages)
    .slice(1)
    .reduce((previousValue, [key, value]) => {
      if (key.match(nestedDependencyRegExp)) {
        const packageNames = key
          .split("node_modules/")
          .filter(Boolean)
          .map((packageName) => packageName.replace(endingSlashRegExp, ""));

        const childPackageName = packageNames.pop();
        const childPackageVersion = value.version;

        const parentPackageIdentifiers = packageNames.map(
          (packageName, index) => {
            const parentPackageInstallationPath = `node_modules/${packageNames
              .slice(0, index + 1)
              .join("/node_modules/")}`;

            return {
              name: packageName,
              version:
                packageLockJson?.packages[parentPackageInstallationPath]
                  ?.version ?? "undefined",
            };
          }
        );

        const targetKey = `${childPackageName}@${childPackageVersion}`;

        return {
          ...previousValue,
          [targetKey]: [
            ...(previousValue[targetKey] || []),
            parentPackageIdentifiers,
          ],
        };
      } else {
        return previousValue;
      }
    }, {} as NestedDependencyPaths);
};
