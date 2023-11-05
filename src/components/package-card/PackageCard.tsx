import { useState } from "react";
import { PackageInformation } from "../../types";
import { getBackgroundColor } from "./getBackgroundColor";
import { PackageCardBody } from "./PackageCardBody";
import { PackageCardHeader } from "./PackageCardHeader";
import "./PackageCard.css";

interface Props extends PackageInformation {
  packageName: string;
  maxDepth: number;
}

export const PackageCard = ({
  packageName,
  maxDepth,
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
}: Props) => {
  const [shouldShowDetails, setShowDetails] = useState(depth === 0);
  const [shouldShowDependencies, setShowDependencies] = useState(false);

  const handleDetailsDisplay = () => {
    setShowDetails((previousState) => !previousState);
  };

  const handleDependenciesDisplay = () => {
    setShowDependencies((previousState) => !previousState);
  };

  return (
    <>
      <div
        className="package-card"
        style={{ backgroundColor: getBackgroundColor({ depth, maxDepth }) }}
      >
        <PackageCardHeader
          packageName={packageName}
          depth={depth}
          version={version}
          dependencyPath={dependencyPath}
          packageMetadata={packageMetadata}
          handleDetailsDisplay={handleDetailsDisplay}
        />
        {shouldShowDetails ? (
          <PackageCardBody
            isDeduped={isDeduped}
            isExtraneous={isExtraneous}
            invalidityDetails={invalidityDetails}
            version={version}
            installationPath={installationPath}
            folderStatistics={folderStatistics}
            packageMetadata={packageMetadata}
            dependencies={dependencies}
            packageName={packageName}
            shouldShowDependencies={shouldShowDependencies}
            handleDependenciesDisplay={handleDependenciesDisplay}
          />
        ) : null}
      </div>
      {shouldShowDependencies ? (
        <>
          {Object.entries(dependencies).map(([key, value]) => (
            <PackageCard
              key={crypto.randomUUID()}
              packageName={key}
              maxDepth={maxDepth}
              {...value}
            />
          ))}
        </>
      ) : null}
    </>
  );
};
