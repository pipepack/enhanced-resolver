/**
 * @description - fill complete file extension
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, of, concat, from, OperatorFunction } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

// internal
import { Request } from '../interface/resolver';

export interface FillOptions {
  extensions: string[];
}

export function fill(options: FillOptions): OperatorFunction<Request, Request> {
  return pipe(
    concatMap((request: Request) =>
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
            const payload: Request = {
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
