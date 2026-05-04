type Nullable<T> = T | null;

export interface Author {
  name: string;
  email?: string;
  url?: string;
}

export interface License {
  type: string;
  url: string | null;
}

export type ModuleFormat = "esm" | "cjs" | "dual";

export interface PackageMetadata {
  author: Nullable<Author>;
  description: Nullable<string>;
  homepage: Nullable<string>;
  keywords: Nullable<string>;
  licenses: License[];
  engines: Nullable<string>;
  moduleFormat: ModuleFormat;
  repository: Nullable<string>;
  types: Nullable<string>;
  readme: Nullable<string>;
}
