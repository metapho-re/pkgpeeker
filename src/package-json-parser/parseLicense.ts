import { License } from "../types";

const multipleLicensesRegExp = /\(([\w.-].*\sOR\s*[\w.-]*)\)/;
const fileNameLicenseRegExp = /SEE\sLICENSE\sIN\s([\w.-/]*)/;

const undefinedLicense = {
  type: "None",
  url: null,
};

const getSPDXUrl = (type: string): string =>
  `https://spdx.org/licenses/${type}`;

interface Props {
  license: string | License | License[] | undefined;
  repositoryUrl: string | null;
}

export const parseLicense = ({ license, repositoryUrl }: Props): License[] => {
  if (typeof license === "string") {
    if (license === "UNLICENSED") {
      return [
        {
          type: license,
          url: null,
        },
      ];
    }

    const [, licenseList] = license.match(multipleLicensesRegExp) || [];

    if (licenseList) {
      return licenseList
        .split(" OR ")
        .map((type) => ({ type, url: getSPDXUrl(type) }));
    }

    const [, fileName] = license.match(fileNameLicenseRegExp) || [];

    if (fileName && repositoryUrl) {
      return [
        {
          type: "Custom",
          url: `${repositoryUrl}/blob/master/${fileName}`,
        },
      ];
    }

    // Support for invalid yet not uncommon syntax
    if (license.indexOf("http") >= 0) {
      return [{ type: "Custom", url: license }];
    }

    return [{ type: license, url: getSPDXUrl(license) }];
  }

  // Support for deprecated syntax: array of license objects
  if (Array.isArray(license)) {
    return license.filter(({ type, url }) => type && url);
  }

  // Support for deprecated syntax: license object
  if (typeof license === "object" && license.type && license.url) {
    return [license];
  }

  return [undefinedLicense];
};
