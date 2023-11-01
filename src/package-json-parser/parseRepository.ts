const domainUserRepositoryRegExp =
  /([A-Za-z0-9-.]*\.[A-Za-z.]*)(?:\/|:)([A-Za-z0-9-]*)\/([\w\-./]*)/;
const userRepositoryRegExp = /^[A-Za-z0-9-]*\/[\w\-./]*$/;
const shortcutRegExp = /^([a-z]*):([\w\-./]*)$/;

const getUrl = (path: string): string | null => {
  const trimmedPath = path.replace(".git", "");

  const [, domainName, userName, repositoryName] =
    trimmedPath.match(domainUserRepositoryRegExp) || [];

  if (domainName && userName && repositoryName) {
    return `https://${domainName}/${userName}/${repositoryName}`;
  }

  if (trimmedPath.match(userRepositoryRegExp)) {
    return `https://github.com/${trimmedPath}`;
  }

  const [, platform, identifier] = trimmedPath.match(shortcutRegExp) || [];

  if (platform && identifier) {
    switch (platform) {
      case "gist": {
        return `https://gist.github.com/${identifier}`;
      }
      case "bitbucket": {
        return `https://bitbucket.org/${identifier}`;
      }
      case "gitlab": {
        return `https://gitlab.com/${identifier}`;
      }
      default: {
        return `https://github.com/${identifier}`;
      }
    }
  }

  return null;
};

export const parseRepository = (
  repository:
    | string
    | {
        type: string;
        url: string;
        directory?: string;
      }
    | undefined
): string | null => {
  if (!repository) {
    return null;
  }

  if (typeof repository === "string") {
    return getUrl(repository);
  }

  if (typeof repository === "object") {
    const url = getUrl(repository.url);

    if (url) {
      const directoryPath = repository.directory
        ? `/tree/master/${repository.directory}`
        : "";

      return `${url}${directoryPath}`;
    }

    return null;
  }

  return null;
};
