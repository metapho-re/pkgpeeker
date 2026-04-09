interface Params {
  packageName: string;
  version: string;
  filePath?: string;
}

export const getUnpkgUrl = ({
  packageName,
  version,
  filePath,
}: Params): string =>
  `https://unpkg.com/browse/${packageName}@${version}/${filePath || ""}`;
