import { WebContainer } from "@webcontainer/api";
import { PackageMetadata } from "../types";
import { parseAuthor } from "./parseAuthor";
import { parseKeywords } from "./parseKeywords";
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
    types,
    typings,
  } = JSON.parse(packageJson);

  const repositoryUrl = parseRepository(repository);

  return {
    author: parseAuthor(author),
    description: nullifyNonString(description),
    homepage: nullifyNonString(homepage),
    keywords: parseKeywords(keywords),
    licenses: parseLicense({ repositoryUrl, license: license || licenses }),
    repository: repositoryUrl,
    types: nullifyNonString(types || typings),
  };
};
