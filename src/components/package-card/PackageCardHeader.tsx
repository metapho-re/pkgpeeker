import { Fragment, MouseEventHandler } from "react";
import { PackageInformation } from "../../types";
import { getUnpkgUrl } from "../../utils";
import {
  MailIcon,
  NpmIcon,
  RepositoryIcon,
  UnpkgIcon,
  WebIcon,
} from "../icons";
import { Popover } from "../popover";
import { DepthTag } from "../tags";
import { getNpmUrl } from "./getNpmUrl";
import "./PackageCardHeader.css";

const invalidSelectorRegExp = /[@|/|.]/g;

const getSelectorFromPath = (path: string[]): string =>
  path.join("_").replace(invalidSelectorRegExp, "_");

const stopEventPropagation: MouseEventHandler<HTMLAnchorElement> = (event) => {
  event.stopPropagation();
};

interface Props
  extends Pick<
    PackageInformation,
    "depth" | "version" | "dependencyPath" | "packageMetadata"
  > {
  packageName: string;
  handleDetailsDisplay: () => void;
}

export const PackageCardHeader = ({
  packageName,
  depth,
  version,
  dependencyPath,
  packageMetadata,
  handleDetailsDisplay,
}: Props) => {
  const handleBreadcrumbNavigationFactory =
    (index: number): MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      document
        .querySelector(
          `#${getSelectorFromPath(dependencyPath.slice(0, index + 1))}`
        )
        ?.scrollIntoView({ behavior: "smooth" });

      event.stopPropagation();
    };

  return (
    <div
      id={getSelectorFromPath(dependencyPath)}
      onClick={handleDetailsDisplay}
    >
      <div className="breadcrumbs">
        {dependencyPath.map((packageName, index) => (
          <Fragment key={crypto.randomUUID()}>
            <button
              className="breadcrumbs__button"
              onClick={handleBreadcrumbNavigationFactory(index)}
            >
              {packageName}
            </button>
            {index !== dependencyPath.length - 1 ? (
              <span className="breadcrumbs__separator">/</span>
            ) : null}
          </Fragment>
        ))}
      </div>
      <div className="header">
        <div className="main-information">
          <p className="name">{packageName}</p>
          <p className="version">v{version}</p>
          {packageMetadata?.author?.name ? (
            <p className="author">
              by{" "}
              {packageMetadata?.author?.url ? (
                <a
                  href={packageMetadata.author.url}
                  target="_blank"
                  onClick={stopEventPropagation}
                >
                  {packageMetadata?.author?.name}
                </a>
              ) : (
                <>{packageMetadata?.author?.name}</>
              )}
            </p>
          ) : null}
          {packageMetadata?.author?.email ? (
            <Popover content="Package author's email">
              <a
                className="links__icon"
                href={`mailto:${packageMetadata.author.email}`}
                onClick={stopEventPropagation}
              >
                <MailIcon />
              </a>
            </Popover>
          ) : null}
          <div className="depth">
            <DepthTag depth={depth} />
          </div>
        </div>
        <div className="links">
          {packageMetadata?.homepage ? (
            <Popover content="Package homepage">
              <a
                className="links__icon"
                href={packageMetadata.homepage}
                target="_blank"
                onClick={stopEventPropagation}
              >
                <WebIcon />
              </a>
            </Popover>
          ) : null}
          {packageMetadata?.repository ? (
            <Popover content="Package source code repository">
              <a
                className="links__icon"
                href={packageMetadata.repository}
                target="_blank"
                onClick={stopEventPropagation}
              >
                <RepositoryIcon />
              </a>
            </Popover>
          ) : null}
          <Popover content="Package content browser on UNPKG">
            <a
              className="links__icon"
              href={getUnpkgUrl({ packageName, version })}
              target="_blank"
              onClick={stopEventPropagation}
            >
              <UnpkgIcon />
            </a>
          </Popover>
          <Popover content="Package page on npm">
            <a
              className="links__icon"
              href={getNpmUrl({ packageName, version })}
              target="_blank"
              onClick={stopEventPropagation}
            >
              <NpmIcon />
            </a>
          </Popover>
        </div>
      </div>
    </div>
  );
};
