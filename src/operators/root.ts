/**
 * @description - convert absolute reference path into relative path with another context
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, of, from, OperatorFunction } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { isAbsolute } from 'path';

// internal
import { Request } from '../interface/resolver';

export interface RootOptions {
  // root candicate means absolute path
  roots: string[];
}

// convert absolute material into relative based on pass-in root options
export function root(options: RootOptions): OperatorFunction<Request, Request> {
  return pipe(
    concatMap((request: Request) => {
      if (isAbsolute(request.referencePathName)) {
        return from(options.roots).pipe(
          map((context) => {
            const payload: Request = {
              ...request,
              context,
              referencePathName: request.referencePathName.replace(/^\//, ''),
            };

            return payload;
          })
        );
      }
      return of(request);
    })
  );
}
