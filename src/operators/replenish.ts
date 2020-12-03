/**
 * @description - fill complete file extension
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, of, concat, from, OperatorFunction } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

// internal
import { assign } from '../utils/assign';

// type
import type { NormalRequest } from '../interface/resolver';

export function replenish(
  extensions: string[]
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(
    concatMap((request: NormalRequest) =>
      concat(
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
      )
    )
  );
}
