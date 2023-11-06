interface Props {
  packageName: string;
  version: string;
  filePath?: string;
}

export const getUnpkgUrl = ({
  packageName,
  version,
  filePath,
}: Props): string =>
  `https://unpkg.com/browse/${packageName}@${version}/${filePath || ""}`;
