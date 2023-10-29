const domainUserRepositoryRegExp =
  /([A-Za-z0-9-.]*\.[A-Za-z.]*)(?:\/|:)([A-Za-z0-9-]*)\/([\w\-./]*)/;
const userRepositoryRegExp = /^([A-Za-z0-9-]*)\/([\w\-./]*)$/;

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
    const url = repository.replace(".git", "");
    const [, domainName, userName, repositoryName] =
      url.match(domainUserRepositoryRegExp) || [];

    if (domainName && userName && repositoryName) {
      return `https://${domainName}/${userName}/${repositoryName}`;
    }

    if (url.match(userRepositoryRegExp)) {
      return `https://github.com/${url}`;
    }

    const [platform, identifier] = url.split(":");

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

  const [, domainName, userName, repositoryName] =
    repository.url.replace(".git", "").match(domainUserRepositoryRegExp) || [];

  if (!(domainName && userName && repositoryName)) {
    return null;
  }

  const directoryPath = repository.directory
    ? `/blob/main/${repository.directory}`
    : "";

  return `https://${domainName}/${userName}/${repositoryName}${directoryPath}`;
};
