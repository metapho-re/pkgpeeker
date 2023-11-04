import { License } from "../../types";
import { BaseTag } from "./BaseTag";

interface Props {
  license: License;
}

export const LicenseTag = ({ license }: Props) => (
  <BaseTag
    type="license"
    title={
      <span>
        License specifying usage permissions
        <br /> and possible restrictions
      </span>
    }
  >
    {license.url ? (
      <a className="tag__link" href={license.url} target="_blank">
        {license.type}
      </a>
    ) : (
      <>{license.type}</>
    )}
  </BaseTag>
);
