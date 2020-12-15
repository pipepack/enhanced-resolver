/**
 * @description - spread node search paths, filter none exist directory
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { isAbsolute } from 'path';
import { from, Observable } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';

// internal
import { isDirectory } from './is';
import { assign } from '../utils/assign';

// type
import type { FileSystem } from '../interface/fs';
import type { NormalRequest } from '../interface/resolver';

export function possible(
  fs: FileSystem,
  modules: string[],
  request: NormalRequest
): Observable<NormalRequest> {
  return from(modules).pipe(
    filter((context) => isAbsolute(context)),
    concatMap((context) =>
      isDirectory(fs, context, assign(request, { context }))
    )
  );
}
