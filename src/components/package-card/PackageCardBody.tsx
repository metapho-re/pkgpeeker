import { PackageInformation } from "../../types";
import { getFormattedSize } from "../../utils";
import { FilesBreakdown } from "../files-breakdown";
import { DedupedTag, ExtraneousTag, InvalidTag, PathTag } from "../tags";
import "./PackageCardBody.css";

interface Props
  extends Omit<PackageInformation, "depth" | "version" | "dependencyPath"> {
  shouldShowDependencies: boolean;
  handleDependenciesDisplay: () => void;
}

export const PackageCardBody = ({
  isDeduped,
  isExtraneous,
  invalidityDetails,
  installationPath,
  folderStatistics,
  packageMetadata,
  dependencies,
  shouldShowDependencies,
  handleDependenciesDisplay,
}: Props) => {
  const { folderSizeInBytes, numberOfFilesInFolder, ...statisticsByExtension } =
    folderStatistics || { folderSizeInBytes: 0, numberOfFilesInFolder: 0 };

  return (
    <>
      {packageMetadata ? (
        <>
          {packageMetadata?.description ? (
            <p>{packageMetadata.description}</p>
          ) : null}
          {packageMetadata?.license ? (
            <p>License: {packageMetadata?.license}</p>
          ) : null}
          <div className="tags">
            <PathTag path={installationPath} />
            {isDeduped ? <DedupedTag /> : null}
            {isExtraneous ? <ExtraneousTag /> : null}
            {invalidityDetails ? (
              <InvalidTag invalidityDetails={invalidityDetails} />
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
