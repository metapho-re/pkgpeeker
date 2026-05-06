import type { LargestFile } from "../folder-analytics";
import type { PackageInformation } from "../types";

export interface CollectorNode {
  packageName: string;
  packageInformation: PackageInformation;
  largestFile: LargestFile | null;
}

export interface TreeCollector<T> {
  collect(node: CollectorNode): void;
  getResult(): T;
}
