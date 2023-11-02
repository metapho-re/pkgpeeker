import { WebContainer } from "@webcontainer/api";
import { PackageMetadata } from "../types";
import { parseAuthor } from "./parseAuthor";
import { parseLicense } from "./parseLicense";
import { parseRepository } from "./parseRepository";

const nullifyNonString = (value: unknown) =>
  typeof value === "string" ? value : null;

interface Props {
  webContainerInstance: WebContainer | undefined;
  installationPath: string;
}

export const getPackageMetadata = async ({
  webContainerInstance,
  installationPath,
}: Props): Promise<PackageMetadata | null> => {
  let packageJson: string | undefined;

  try {
    packageJson = await webContainerInstance?.fs.readFile(
      `${installationPath}/package.json`,
      "utf-8"
    );
  } catch (_) {
    // fail silently
  }

  if (!packageJson) {
    return null;
  }

  const {
    author,
    description,
    homepage,
    keywords,
    license,
    licenses,
    repository,
  } = JSON.parse(packageJson);

  const repositoryUrl = parseRepository(repository);

  return {
    author: parseAuthor(author),
    description: nullifyNonString(description),
    homepage: nullifyNonString(homepage),
    keywords: keywords && keywords.length > 0 ? keywords : null,
    licenses: parseLicense({ repositoryUrl, license: license || licenses }),
    repository: repositoryUrl,
  };
};
