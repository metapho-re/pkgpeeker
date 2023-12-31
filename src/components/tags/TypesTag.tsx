import { getUnpkgUrl } from "../../utils";
import { BaseTag } from "./BaseTag";

interface Props {
  packageName: string;
  version: string;
  types: string;
}

export const TypesTag = ({ packageName, version, types }: Props) => (
  <BaseTag
    type="types"
    title="TypeScript declaration files are provided by this package."
  >
    <a
      className="tag__link"
      href={getUnpkgUrl({ packageName, version, filePath: types })}
      target="_blank"
    >
      Types
    </a>
  </BaseTag>
);
