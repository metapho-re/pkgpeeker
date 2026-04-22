import { execSync } from "node:child_process";
import { mkdtemp, readdir, stat, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";

const TARGET_PACKAGE_COUNT = 200;

const fetchPopularPackages = async () => {
  const url = new URL("https://registry.npmjs.org/-/v1/search");

  url.searchParams.set("text", "keywords:");
  url.searchParams.set("popularity", "1.0");
  url.searchParams.set("quality", "0.0");
  url.searchParams.set("maintenance", "0.0");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `npm search failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  const packages = new Set();

  for (const entry of data.objects) {
    packages.add(entry.package.name);

    if (packages.size >= TARGET_PACKAGE_COUNT) {
      break;
    }
  }

  return [...packages];
};

const getDirectoryStatistics = async (directoryPath) => {
  let totalSize = 0;
  let fileCount = 0;

  const entries = await readdir(directoryPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(directoryPath, entry.name);

    if (entry.isFile()) {
      const fileStatistics = await stat(fullPath);

      totalSize += fileStatistics.size;
      fileCount += 1;
    }

    if (entry.isDirectory()) {
      if (entry.name === "node_modules") {
        continue;
      }

      const subdirectoryStatistics = await getDirectoryStatistics(fullPath);

      totalSize += subdirectoryStatistics.totalSize;
      fileCount += subdirectoryStatistics.fileCount;
    }
  }

  return { totalSize, fileCount };
};

const computeResults = async (nodeModulesPath) => {
  const topLevelEntries = await readdir(nodeModulesPath, {
    withFileTypes: true,
  });

  const results = [];

  for (const topLevelEntry of topLevelEntries) {
    if (!topLevelEntry.isDirectory() || topLevelEntry.name.startsWith(".")) {
      continue;
    }

    if (topLevelEntry.name.startsWith("@")) {
      const scopedEntries = await readdir(
        join(nodeModulesPath, topLevelEntry.name),
        {
          withFileTypes: true,
        },
      );

      for (const scopedEntry of scopedEntries) {
        if (!scopedEntry.isDirectory()) {
          continue;
        }

        const { totalSize, fileCount } = await getDirectoryStatistics(
          join(nodeModulesPath, topLevelEntry.name, scopedEntry.name),
        );

        if (fileCount > 0) {
          results.push({
            pkgName: `${topLevelEntry.name}/${scopedEntry.name}`,
            totalSize,
            fileCount,
            bytesPerFile: totalSize / fileCount,
          });
        }
      }
    } else {
      const { totalSize, fileCount } = await getDirectoryStatistics(
        join(nodeModulesPath, topLevelEntry.name),
      );

      if (fileCount > 0) {
        results.push({
          pkgName: topLevelEntry.name,
          totalSize,
          fileCount,
          bytesPerFile: totalSize / fileCount,
        });
      }
    }
  }

  return results;
};

async function main() {
  console.log(
    `Fetching top ${TARGET_PACKAGE_COUNT} packages by popularity from npm...`,
  );
  const packages = await fetchPopularPackages();
  console.log(`Done.\n`);

  console.log("Creating temporary working directory...");
  const tmpDirectory = await mkdtemp(join(tmpdir(), "bytes-per-file-"));
  console.log(`Done.\n`);

  console.log("Creating package.json file...");
  await writeFile(
    join(tmpDirectory, "package.json"),
    JSON.stringify({ name: "baseline", private: true, dependencies: {} }),
  );
  console.log("Done.\n");

  console.log(`Installing ${packages.length} packages...`);
  execSync(`npm install --ignore-scripts ${packages.join(" ")}`, {
    cwd: tmpDirectory,
    stdio: "inherit",
  });
  console.log("Done.\n");

  console.log("Processing data...");
  const results = await computeResults(join(tmpDirectory, "node_modules"));
  console.log("Done.\n");

  console.log("Cleaning up installation directory...");
  await rm(tmpDirectory, { recursive: true, force: true });
  console.log("Done.\n");

  results.sort((a, b) => a.bytesPerFile - b.bytesPerFile);

  const middleIndex = Math.floor(results.length / 2);
  const median =
    results.length % 2 === 0
      ? (results[middleIndex - 1].bytesPerFile +
          results[middleIndex].bytesPerFile) /
        2
      : results[middleIndex].bytesPerFile;

  console.log("\n--- Results ---");
  console.log(`Packages processed: ${results.length}`);
  console.log(
    `Min bytes/file: ${Math.round(results[0].bytesPerFile)} (${results.at(0).pkgName})`,
  );
  console.log(
    `Max bytes/file: ${Math.round(results.at(-1).bytesPerFile)} (${results.at(-1).pkgName})`,
  );
  console.log(`Median bytes/file: ${Math.round(median)}`);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
