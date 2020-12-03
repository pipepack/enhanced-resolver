/**
 * @description - directory related operators
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, from, merge } from 'rxjs';
import {
  concatMap,
  defaultIfEmpty,
  map,
  publishLast,
  refCount,
} from 'rxjs/operators';
import { join } from 'path';
import type { OperatorFunction } from 'rxjs';

// internal
import { isDirectory } from './is';
import { assign } from '../utils/assign';

// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest } from '../interface/resolver';

/**
 * expand possible index filename when probe directory, repush request otherwise
 */
export function directory(
  fs: FileSystem,
  indexes: string[]
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(
    concatMap((request: NormalRequest) => {
      const absPath = join(request.context, request.referencePathName);
      const isDirectory$ = isDirectory(fs, absPath, request).pipe(
        publishLast(),
        refCount()
      );

      return merge(
        // when request not directory, just pass through
        isDirectory$.pipe(defaultIfEmpty(request)),
        // when absPath directory, spread indexes
        isDirectory$.pipe(
          // any *Map operator consider valid here
          concatMap(() =>
            from(indexes).pipe(
              map((index) =>
                assign(request, {
                  context: absPath,
                  referencePathName: index,
                })
              )
            )
          )
        )
      );
    })
  );
}
