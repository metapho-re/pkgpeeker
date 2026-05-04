export const parseDependenciesFromPackageJson = (content: string): string[] => {
  const json = JSON.parse(content);
  const dependencies = json.dependencies;

  if (!dependencies || typeof dependencies !== "object") {
    return [];
  }

  return Object.entries(dependencies).map(
    ([name, version]) => `${name}@${version}`,
  );
};
