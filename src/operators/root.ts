/**
 * @description - convert absolute reference path into relative path with another context
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, of, from, OperatorFunction } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { isAbsolute } from 'path';

// internal
import { NormalRequest } from '../interface/resolver';

export interface RootOptions {
  // root candicate means absolute path
  roots: string[];
}

// convert absolute material into relative based on pass-in root options
export function root(
  options: RootOptions
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(
    concatMap((request: NormalRequest) => {
      if (isAbsolute(request.referencePathName)) {
        return from(options.roots).pipe(
          map((context) => {
            const payload: NormalRequest = {
              ...request,
              context,
              referencePathName: request.referencePathName.replace(/^\/+/, ''),
            };

            return payload;
          })
        );
      }
      return of(request);
    })
  );
}
