export const views = ["", "files", "security"] as const;

export type View = (typeof views)[number];

export const parseLocation = (
  pathname: string,
): { packages: string; view: View } => {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "";
  const isView = views.includes(lastSegment as View);

  return {
    packages: (isView ? segments.slice(0, -1) : segments).join("/"),
    view: isView ? (lastSegment as View) : "",
  };
};

export const createLocation = (packages: string, view: View = ""): string =>
  `/${packages}${view ? `/${view}` : ""}`;

export const getPackagesFromPath = (pathname: string): string => {
  const { packages } = parseLocation(pathname);

  return packages ? decodeURIComponent(packages).split(",").join(" ") : "";
};
