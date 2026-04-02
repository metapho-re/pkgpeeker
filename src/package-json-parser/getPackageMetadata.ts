import { WebContainer } from "@webcontainer/api";
import { PackageMetadata } from "../types";
import { parseAuthor } from "./parseAuthor";
import { parseEngines } from "./parseEngines";
import { parseKeywords } from "./parseKeywords";
import { parseLicense } from "./parseLicense";
import { parseModuleFormat } from "./parseModuleFormat";
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
      "utf-8",
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
    exports,
    homepage,
    keywords,
    license,
    licenses,
    main,
    module,
    repository,
    engines,
    type,
    types,
    typings,
  } = JSON.parse(packageJson);

  const repositoryUrl = parseRepository(repository);

  let readme: string | null = null;

  for (const filename of ["README.md", "readme.md", "Readme.md", "README"]) {
    try {
      readme =
        (await webContainerInstance?.fs.readFile(
          `${installationPath}/${filename}`,
          "utf-8",
        )) ?? null;

      if (readme) {
        break;
      }
    } catch (_) {
      // file doesn't exist, try next
    }
  }

  return {
    author: parseAuthor(author),
    description: nullifyNonString(description),
    engines: parseEngines(engines),
    homepage: nullifyNonString(homepage),
    keywords: parseKeywords(keywords),
    licenses: parseLicense({ repositoryUrl, license: license || licenses }),
    moduleFormat: parseModuleFormat({ type, main, module, exports }),
    repository: repositoryUrl,
    types: nullifyNonString(types || typings),
    readme,
  };
};
