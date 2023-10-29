interface Props {
  packageName: string;
  version: string;
}

export const getNpmUrl = ({ packageName, version }: Props): string =>
  `https://npmjs.com/package/${packageName}/v/${version}`;
