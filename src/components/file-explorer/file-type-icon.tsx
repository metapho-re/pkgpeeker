import { getExtension } from "../../utils";

import {
  COMPOUND_EXTENSION_ICON_MAP,
  EXTENSION_ICON_MAP,
  FILENAME_ICON_MAP,
} from "./file-type-icon-map";
import iconsData from "./icons.json";

interface IconEntry {
  body: string;
  width?: number;
  height?: number;
}

const icons = iconsData.icons as Record<string, IconEntry>;
const defaultWidth = iconsData.width;
const defaultHeight = iconsData.height;

const getIcon = (name: string): IconEntry => {
  return icons[name] ?? icons["document"];
};

const getFileIcon = (fileName: string): IconEntry => {
  if (FILENAME_ICON_MAP[fileName]) {
    return getIcon(FILENAME_ICON_MAP[fileName]);
  }

  const extension = getExtension(fileName);

  return getIcon(
    COMPOUND_EXTENSION_ICON_MAP[extension] ??
      EXTENSION_ICON_MAP[extension] ??
      "document",
  );
};

const ICON_SIZE = 20;

interface Props {
  fileName: string;
  isDirectory: boolean;
  isExpanded?: boolean;
}

export const FileTypeIcon = ({ fileName, isDirectory, isExpanded }: Props) => {
  const icon = isDirectory
    ? getIcon(isExpanded ? "folder-base-open" : "folder-base")
    : getFileIcon(fileName);

  const width = icon.width ?? defaultWidth;
  const height = icon.height ?? defaultHeight;

  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox={`0 0 ${width} ${height}`}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
};
