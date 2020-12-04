/**
 * @description - fill complete file extension
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { of, concat, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// internal
import { assign } from '../utils/assign';

// type
import type { NormalRequest } from '../interface/resolver';

export function replenish(
  request: NormalRequest,
  extensions: string[]
): Observable<NormalRequest> {
  return concat(
    // without extra extension
    of(request),
    // with extra extension
    from(extensions).pipe(
      map((extension) =>
        assign(request, {
          // allow missing dot
          referencePathName: extension.startsWith('.')
            ? `${request.referencePathName}${extension}`
            : `${request.referencePathName}.${extension}`,
        })
      )
    )
  );
}
