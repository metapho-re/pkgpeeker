import { Fragment } from "react";
import { PackageInformation } from "../../types";
import {
  getFormattedSize,
  getNpmUrl,
  getTreePath,
  getTotalDependenciesSize,
  getUnpkgUrl,
} from "../../utils";
import { FilesBreakdown } from "../files-breakdown";
import {
  MailIcon,
  NpmIcon,
  RepositoryIcon,
  UnpkgIcon,
  WebIcon,
} from "../icons";
import { Popover } from "../popover";
import {
  DedupedTag,
  DependenciesTag,
  DepthTag,
  ExtraneousTag,
  InvalidTag,
  KeywordsTag,
  LicenseTag,
  ModuleFormatTag,
  PathTag,
  TypesTag,
} from "../tags";
import "./PackageDetail.css";

interface Props {
  packageName: string;
  packageInformation: PackageInformation;
  onNavigate: (path: string) => void;
}

export const PackageDetail = ({
  packageName,
  packageInformation,
  onNavigate,
}: Props) => {
  const {
    depth,
    isDeduped,
    isExtraneous,
    invalidityDetails,
    version,
    installationPath,
    dependencyPath,
    folderStatistics,
    packageMetadata,
    dependencies,
  } = packageInformation;

  const { folderSizeInBytes, numberOfFilesInFolder, ...statisticsByExtension } =
    folderStatistics || { folderSizeInBytes: 0, numberOfFilesInFolder: 0 };

  const handleBreadcrumbClick = (index: number) => {
    const targetPath = dependencyPath.slice(0, index + 1);

    onNavigate(getTreePath(targetPath));
  };

  return (
    <div className="package-detail">
      <div className="detail-breadcrumbs">
        {dependencyPath.map(({ name }, index) => (
          <Fragment key={`${name}-${index}`}>
            <button
              className="detail-breadcrumbs__button"
              onClick={() => handleBreadcrumbClick(index)}
            >
              {name}
            </button>
            {index !== dependencyPath.length - 1 && (
              <span className="detail-breadcrumbs__separator">/</span>
            )}
          </Fragment>
        ))}
      </div>
      <div className="detail-header">
        <div className="detail-header__main">
          <p className="detail-header__name">{packageName}</p>
          <p className="detail-header__version">v{version}</p>
          {packageMetadata?.author?.name && (
            <p className="detail-header__author">
              by{" "}
              {packageMetadata?.author?.url ? (
                <a href={packageMetadata.author.url} target="_blank">
                  {packageMetadata.author.name}
                </a>
              ) : (
                packageMetadata.author.name
              )}
            </p>
          )}
          {packageMetadata?.author?.email && (
            <Popover content="Package author's email">
              <a
                className="detail-links__icon"
                href={`mailto:${packageMetadata.author.email}`}
              >
                <MailIcon />
              </a>
            </Popover>
          )}
          <div className="detail-header__badges">
            <DepthTag depth={depth} />
            <DependenciesTag count={Object.keys(dependencies).length} />
          </div>
        </div>
        <div className="detail-links">
          {packageMetadata?.homepage && (
            <Popover content="Package homepage">
              <a
                className="detail-links__icon"
                href={packageMetadata.homepage}
                target="_blank"
              >
                <WebIcon />
              </a>
            </Popover>
          )}
          {packageMetadata?.repository && (
            <Popover content="Package source code repository">
              <a
                className="detail-links__icon"
                href={packageMetadata.repository}
                target="_blank"
              >
                <RepositoryIcon />
              </a>
            </Popover>
          )}
          <Popover content="Package content browser on UNPKG">
            <a
              className="detail-links__icon"
              href={getUnpkgUrl({ packageName, version })}
              target="_blank"
            >
              <UnpkgIcon />
            </a>
          </Popover>
          <Popover content="Package page on npm">
            <a
              className="detail-links__icon"
              href={getNpmUrl({ packageName, version })}
              target="_blank"
            >
              <NpmIcon />
            </a>
          </Popover>
        </div>
      </div>
      {packageMetadata ? (
        <div className="package-detail__body">
          <div className="detail-description">
            {packageMetadata.description ? (
              <span>{packageMetadata.description}</span>
            ) : (
              <i>No description available</i>
            )}
            {packageMetadata.keywords && (
              <KeywordsTag keywords={packageMetadata.keywords} />
            )}
          </div>
          <div className="detail-licenses">
            <span>
              {`License${packageMetadata.licenses.length > 1 ? "s" : ""}:`}
            </span>
            {packageMetadata.licenses.map((license, index) => (
              <LicenseTag key={`${index}${license.type}`} license={license} />
            ))}
          </div>
          <div className="detail-tags">
            <PathTag path={installationPath} />
            {isDeduped && <DedupedTag />}
            {isExtraneous && <ExtraneousTag />}
            {invalidityDetails && (
              <InvalidTag invalidityDetails={invalidityDetails} />
            )}
            <ModuleFormatTag moduleFormat={packageMetadata.moduleFormat} />
            {packageMetadata.types && (
              <TypesTag
                packageName={packageName}
                version={version}
                types={packageMetadata.types}
              />
            )}
          </div>
          <div className="detail-folder-section">
            <p>
              Folder size: {getFormattedSize(folderSizeInBytes)} (
              {numberOfFilesInFolder} files)
              {Object.keys(dependencies).length > 0 && (
                <span className="detail-folder-section__total">
                  {getFormattedSize(
                    folderSizeInBytes + getTotalDependenciesSize(dependencies),
                  )}{" "}
                  with dependencies
                </span>
              )}
            </p>
            {folderStatistics && (
              <FilesBreakdown
                folderSizeInBytes={folderSizeInBytes}
                {...statisticsByExtension}
              />
            )}
          </div>
          <div className="detail-dependencies-section">
            <p className="detail-dependencies-section__label">Dependencies:</p>
            {Object.keys(dependencies).length > 0 ? (
              <div className="detail-dependencies">
                {Object.entries(dependencies).map(
                  ([name, { dependencyPath, version }]) => {
                    const treePath = getTreePath(dependencyPath);

                    return (
                      <button
                        key={treePath}
                        className="detail-dependencies__pill"
                        onClick={() => onNavigate(treePath)}
                      >
                        {name}
                        <span className="detail-dependencies__version">
                          {version}
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            ) : (
              <p>none</p>
            )}
          </div>
        </div>
      ) : (
        <p>
          This package appears in the dependency list but has not been actually
          installed.
        </p>
      )}
    </div>
  );
};
