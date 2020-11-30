/**
 * @description - fill complete file extension
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, of, concat, from, OperatorFunction } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

// internal
import type { NormalRequest } from '../interface/resolver';

export interface FillOptions {
  extensions: string[];
}

export function fill(
  options: FillOptions
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(
    concatMap((request: NormalRequest) =>
      concat(
        // without extra extension
        of(request),
        // with extra extension
        from(options.extensions).pipe(
          map((extension) => {
            const extra = {
              // allow missing dot
              referencePathName: extension.startsWith('.')
                ? `${request.referencePathName}${extension}`
                : `${request.referencePathName}.${extension}`,
            };
            // explicit returen type
            const payload: NormalRequest = {
              ...request,
              ...extra,
            };

            return payload;
          })
        )
      )
    )
  );
}
