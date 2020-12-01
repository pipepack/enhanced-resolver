// package
import { Optional } from 'utility-types';

/* resolver block */
export interface Material {
  // current working directory, keep consistance with initial entry
  context: string;
  // original reference path, forbidden extra usage
  referencePath: string;
  // original file where reference occur, with literal filename
  issuer?: string;
}

// only relative or absolute path
export interface ReferencePathMeta {
  // standard source path
  referencePathName: string;
  // just preserve, not affect match algorithm
  referencePathQuery: string;
  // just preserve, not affect match algorithm
  referencePathFragment: string;
}

// module reference only
export interface ReferencePathModule {
  // package name
  referenceModuleName: string;
  // package subpath
  referenceModuleSubPath: string;
}

export interface NormalRequest extends Material, ReferencePathMeta {}
export interface ModuleRequest extends NormalRequest, ReferencePathModule {
  pkg?: PKG;
}

export interface NormalTerminal extends NormalRequest {
  // 文件绝对路径
  absPath: string;
}

/* package.json concerns */
export type AvailableField = 'main' | 'module' | 'browser';

export interface PKG extends Optional<Record<AvailableField, string>> {
  [key: string]: unknown;
}
