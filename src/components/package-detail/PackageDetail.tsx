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
  EnginesTag,
  ExtraneousTag,
  InvalidTag,
  KeywordsTag,
  LicenseTag,
  ModuleFormatTag,
  PathTag,
  TypesTag,
} from "../tags";
import { ReadmeSection } from "./ReadmeSection";
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
  const dependencyCount = Object.keys(dependencies).length;
  const totalSize = folderSizeInBytes + getTotalDependenciesSize(dependencies);

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
          <div className="detail-stats-grid">
            <div className="detail-stat-card">
              <p className="detail-stat-card__label">Package size</p>
              <p className="detail-stat-card__value detail-stat-card__value--green">
                {getFormattedSize(folderSizeInBytes)}
              </p>
              <p className="detail-stat-card__sub">
                {numberOfFilesInFolder} files
              </p>
            </div>
            <div className="detail-stat-card">
              <p className="detail-stat-card__label">Dependencies</p>
              <p className="detail-stat-card__value detail-stat-card__value--orange">
                {dependencyCount > 0
                  ? getFormattedSize(totalSize - folderSizeInBytes)
                  : "—"}
              </p>
              <p className="detail-stat-card__sub">
                {dependencyCount} direct{" "}
                {dependencyCount === 1 ? "dependency" : "dependencies"}
              </p>
            </div>
            <div className="detail-stat-card">
              <p className="detail-stat-card__label">Total size</p>
              <p className="detail-stat-card__value detail-stat-card__value--accent">
                {getFormattedSize(totalSize)}
              </p>
            </div>
            <div className="detail-stat-card">
              <p className="detail-stat-card__label">Path</p>
              <PathTag path={installationPath} />
              <div className="detail-stat-card__tags">
                {isDeduped && <DedupedTag />}
                {isExtraneous && <ExtraneousTag />}
                {invalidityDetails && (
                  <InvalidTag invalidityDetails={invalidityDetails} />
                )}
              </div>
            </div>
            <div className="detail-stat-card">
              <p className="detail-stat-card__label">Module</p>
              <ModuleFormatTag moduleFormat={packageMetadata.moduleFormat} />
            </div>
            <div className="detail-stat-card">
              <p className="detail-stat-card__label">
                {packageMetadata.licenses.length > 1 ? "Licenses" : "License"}
              </p>
              <div className="detail-stat-card__tags">
                {packageMetadata.licenses.length > 0 ? (
                  packageMetadata.licenses.map((license, index) => (
                    <LicenseTag
                      key={`${index}${license.type}`}
                      license={license}
                    />
                  ))
                ) : (
                  <span className="detail-stat-card__value">Unknown</span>
                )}
              </div>
            </div>
            <div className="detail-stat-card">
              <p className="detail-stat-card__label">Types</p>
              {packageMetadata.types ? (
                <TypesTag
                  packageName={packageName}
                  version={version}
                  types={packageMetadata.types}
                />
              ) : (
                <span className="detail-stat-card__value">None</span>
              )}
            </div>
            <div className="detail-stat-card">
              <p className="detail-stat-card__label">Engines</p>
              {packageMetadata.engines ? (
                <EnginesTag engines={packageMetadata.engines} />
              ) : (
                <span className="detail-stat-card__value">Any</span>
              )}
            </div>
          </div>

          <div className="detail-section">
            <p className="detail-section__header">Description</p>
            <div className="detail-description">
              {packageMetadata.description ? (
                <span>{packageMetadata.description}</span>
              ) : (
                <i>No description available</i>
              )}
            </div>
            {packageMetadata.keywords && (
              <div className="detail-tags-row">
                <KeywordsTag keywords={packageMetadata.keywords} />
              </div>
            )}
          </div>

          <div className="detail-bottom-grid">
            {folderStatistics && (
              <div className="detail-section">
                <p className="detail-section__header">File composition</p>
                <FilesBreakdown
                  folderSizeInBytes={folderSizeInBytes}
                  {...statisticsByExtension}
                />
              </div>
            )}

            <div className="detail-section">
              <p className="detail-section__header">Dependencies</p>
              {dependencyCount > 0 ? (
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
                <p className="detail-dependencies__empty">
                  No direct dependencies
                </p>
              )}
            </div>
          </div>
          {packageMetadata.readme && (
            <ReadmeSection readme={packageMetadata.readme} />
          )}
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
