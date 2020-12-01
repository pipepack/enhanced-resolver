/**
 * @description - spread by reference subpath
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { join } from 'path';
import { Observable, of, OperatorFunction, pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';
// internal
import { assign } from '../utils/assign';

// types
import type { ModuleRequest } from '../interface/resolver';

/**
 * only when referenceModuleSubPath not empty
 */
export function useDirectSubpath(): OperatorFunction<
  ModuleRequest,
  ModuleRequest
> {
  return pipe(
    filter((request) => request.referenceModuleSubPath.length > 0),
    map((request) =>
      assign(request, {
        context: join(request.context, request.referenceModuleSubPath),
      })
    )
  );
}

export function fromDirectSubpath(
  request: ModuleRequest
): Observable<ModuleRequest> {
  return of(request).pipe(useDirectSubpath());
}
