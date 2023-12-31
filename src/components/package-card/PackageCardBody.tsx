import { PackageInformation } from "../../types";
import { getFormattedSize } from "../../utils";
import { FilesBreakdown } from "../files-breakdown";
import {
  DedupedTag,
  ExtraneousTag,
  InvalidTag,
  KeywordsTag,
  LicenseTag,
  PathTag,
  TypesTag,
} from "../tags";
import "./PackageCardBody.css";

interface Props extends Omit<PackageInformation, "depth" | "dependencyPath"> {
  packageName: string;
  shouldShowDependencies: boolean;
  handleDependenciesDisplay: () => void;
}

export const PackageCardBody = ({
  isDeduped,
  isExtraneous,
  invalidityDetails,
  version,
  installationPath,
  folderStatistics,
  packageMetadata,
  dependencies,
  packageName,
  shouldShowDependencies,
  handleDependenciesDisplay,
}: Props) => {
  const { folderSizeInBytes, numberOfFilesInFolder, ...statisticsByExtension } =
    folderStatistics || { folderSizeInBytes: 0, numberOfFilesInFolder: 0 };

  return (
    <>
      {packageMetadata ? (
        <>
          <div className="description">
            {packageMetadata.description ? (
              <span>{packageMetadata.description}</span>
            ) : (
              <i>No description available</i>
            )}
            {packageMetadata.keywords ? (
              <KeywordsTag keywords={packageMetadata.keywords} />
            ) : null}
          </div>
          <div className="licenses">
            <span>
              {`License${packageMetadata.licenses.length > 1 ? "s" : ""}:`}
            </span>
            {packageMetadata.licenses.map((license, index) => (
              <LicenseTag key={`${index}${license.type}`} license={license} />
            ))}
          </div>
          <div className="tags">
            <PathTag path={installationPath} />
            {isDeduped ? <DedupedTag /> : null}
            {isExtraneous ? <ExtraneousTag /> : null}
            {invalidityDetails ? (
              <InvalidTag invalidityDetails={invalidityDetails} />
            ) : null}
            {packageMetadata.types ? (
              <TypesTag
                packageName={packageName}
                version={version}
                types={packageMetadata.types}
              />
            ) : null}
          </div>
          <p>
            Folder size: {getFormattedSize(folderSizeInBytes)} (
            {numberOfFilesInFolder} files)
          </p>
          {folderStatistics ? (
            <FilesBreakdown
              folderSizeInBytes={folderSizeInBytes}
              {...statisticsByExtension}
            />
          ) : null}
          <div className="dependencies">
            <p>Dependencies:</p>
            {Object.keys(dependencies).length > 0 ? (
              <button
                className="dependencies__button"
                onClick={handleDependenciesDisplay}
              >
                {shouldShowDependencies ? "Hide" : "Show"}
              </button>
            ) : (
              <p>none</p>
            )}
          </div>
        </>
      ) : (
        <p>
          This package appears in the dependency list but has not been actually
          installed.
        </p>
      )}
    </>
  );
};
