/* resolver block */
export interface Material {
  // current working directory, keep consistance with initial entry
  context: string;
  // original reference path, forbidden extra usage
  referencePath: string;
  // original file where reference occur, with literal filename
  issuer: string;
}

export interface ReferencePathMeta {
  // standard source path
  referencePathName: string;
  // just preserve, not affect match algorithm
  referencePathQuery: string;
  // just preserve, not affect match algorithm
  referencePathFragment: string;
}

export interface Request extends Material, ReferencePathMeta {}

export interface Terminal extends Request {
  // 文件绝对路径
  absPath: string;
}
