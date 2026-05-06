import type {
  FlatDependencyIndex,
  MostDependedOnPackage,
  PackageIdentifier,
} from "../types";

import { createDeepestDependencyChainCollector } from "./create-deepest-dependency-chain-collector";
import { createFlatIndexCollector } from "./create-flat-index-collector";
import {
  createLargestFileCollector,
  type LargestFileMatch,
} from "./create-largest-file-collector";
import { createReverseDependencyCollector } from "./create-reverse-dependency-collector";
import type { CollectorNode } from "./types";

export interface CollectorResults {
  flatIndex: FlatDependencyIndex;
  deepestDependencyChain: PackageIdentifier[] | null;
  largestFileMatch: LargestFileMatch | null;
  mostDependedOnPackage: MostDependedOnPackage | null;
}

export interface CollectorRunner {
  collect(node: CollectorNode): void;
  getResults(): CollectorResults;
}

export const createCollectorRunner = (): CollectorRunner => {
  const flatIndex = createFlatIndexCollector();
  const deepestDependencyChain = createDeepestDependencyChainCollector();
  const largestFile = createLargestFileCollector();
  const reverseDependency = createReverseDependencyCollector();

  return {
    collect(node: CollectorNode) {
      flatIndex.collect(node);
      deepestDependencyChain.collect(node);
      largestFile.collect(node);
      reverseDependency.collect(node);
    },
    getResults() {
      return {
        flatIndex: flatIndex.getResult(),
        deepestDependencyChain: deepestDependencyChain.getResult(),
        largestFileMatch: largestFile.getResult(),
        mostDependedOnPackage: reverseDependency.getResult(),
      };
    },
  };
};
