// package
import { Optional } from 'utility-types';
import { Channel } from '../utils/constant';

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

export interface PKG extends Optional<Record<AvailableField, string>> {
  [key: string]: unknown;
}

export type NormalRequest = Material & ReferencePathNormal & ReferencePathNode;

export interface NormalTerminal extends NormalRequest {
  // search result
  absPath: string;
}
