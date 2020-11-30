/**
 * @description - parse original reference path, split pathname, query, hash extra
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL } from 'url';
// internal
import type {
  Material,
  NormalRequest,
  ModuleRequest,
  ReferencePathMeta,
  ReferencePathModule,
} from '../interface/resolver';

export function parseReferencePath(): OperatorFunction<
  Material,
  NormalRequest
> {
  return pipe(
    map((m: Material) => {
      const { referencePath } = m;
      // just convert file path into url path to extract search and fragment
      const url = new URL(referencePath, 'https://github.com');
      const referencePathMeta: ReferencePathMeta = {
        referencePathName: url.pathname,
        referencePathQuery: url.search.replace(/^\?/, ''),
        referencePathFragment: url.hash.replace(/^#/, ''),
      };

      const payload: NormalRequest = { ...m, ...referencePathMeta };

      return payload;
    })
  );
}

/**
 * @description - assume imported package name valid for now
 */
export function parseReferenceModule(): OperatorFunction<
  NormalRequest,
  ModuleRequest
> {
  const regexp = {
    normal: /^([^/@]+)(?:\/([^@]+))?/,
    scoped: /^(@[^/]+\/[^/@]+)(?:\/([^@]+))?/,
  };

  return pipe(
    map((m: NormalRequest) => {
      const { referencePathName } = m;
      // pre-requirement receive valid package name
      const [
        ,
        referenceModuleName,
        referenceModuleSubPath,
      ] = referencePathName.startsWith('@')
        ? (regexp.scoped.exec(referencePathName) as RegExpExecArray)
        : (regexp.normal.exec(referencePathName) as RegExpExecArray);
      const extra: ReferencePathModule = {
        referenceModuleName,
        referenceModuleSubPath,
      };
      const payload: ModuleRequest = { ...m, ...extra };

      return payload;
    })
  );
}
