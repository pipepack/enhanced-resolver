// internal
import { Channel } from '../utils/constant';
// types
import type { FileSystem } from './fs';

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
export interface ReferencePathNormal {
  // distribute different pool
  channel: Channel;
  // standard source path
  referencePathName: string;
  // just preserve, not affect match algorithm
  referencePathQuery: string;
  // just preserve, not affect match algorithm
  referencePathFragment: string;
}

// module reference only
export interface ReferencePathNode {
  // package name
  referenceModuleName: string;
  // package subpath
  referenceModuleSubpath: string;
}

// return type of parse operator
export type NormalRequest = Material & ReferencePathNormal;

export interface NormalTerminal extends NormalRequest {
  // search result
  absPath: string;
}

/* Resolver */
export interface RelativeResolverOptions {
  fs: FileSystem;
  // https://webpack.js.org/configuration/resolve/#resolveextensions
  extensions: string[];
  // https://webpack.js.org/configuration/resolve/#resolvemodules
  modules: string[];
  // https://webpack.js.org/configuration/resolve/#resolvemainfields
  mainFields: string[];
  // https://webpack.js.org/configuration/resolve/#resolvemainfiles
  mainFiles: string[];
  // https://webpack.js.org/configuration/resolve/#resolvedescriptionfiles
  descriptionFiles: string[];
}

export type ModuleDescription = Record<string, unknown>;
