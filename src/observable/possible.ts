// package
import { isAbsolute } from 'path';
import { from, Observable } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';

// internal
import { isAliasDirectory } from './is';
import { assign } from '../utils/assign';

// type
import type { FileSystem } from '../interface/fs';
import type { NormalRequest } from '../interface/resolver';

/**
 * only speard search paths
 */
export function possible(
  fs: FileSystem,
  modules: string[],
  request: NormalRequest
): Observable<NormalRequest> {
  return from(modules).pipe(
    filter((context) => isAbsolute(context)),
    concatMap((context) =>
      isAliasDirectory(fs, context, assign(request, { context }))
    )
  );
}
