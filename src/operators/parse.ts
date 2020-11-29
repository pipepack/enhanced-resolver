/**
 * @description - parse original reference path, split pathname, query, hash extra
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL } from 'url';
// internal
import { Material, ReferencePathMeta, Request } from '../interface/resolver';

export function parse(): OperatorFunction<Material, Request> {
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

      const payload: Request = { ...m, ...referencePathMeta };

      return payload;
    })
  );
}
