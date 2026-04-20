interface Params {
  packageName: string;
  version: string;
}

export const getNpmUrl = ({ packageName, version }: Params): string =>
  `https://npmjs.com/package/${packageName}/v/${version}`;
