/**
 * @description - directory related operators
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, from, of } from 'rxjs';
import { concatMap, defaultIfEmpty, filter, map } from 'rxjs/operators';
import { join, isAbsolute } from 'path';
import type { OperatorFunction } from 'rxjs';

// internal
import { isDirectory } from './is';
import { assign } from '../utils/assign';
import { Channel } from '../utils/constant';

// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest } from '../interface/resolver';

export interface DirectoryIndexOptions {
  indexes: string[];
  fs: FileSystem;
}

/**
 * expand possible index filename when probe directory, repush request otherwise
 */
export function spreadDirectoryIndex(
  options: DirectoryIndexOptions
): OperatorFunction<NormalRequest, NormalRequest> {
  const { fs, indexes } = options;

  return pipe(
    concatMap((request: NormalRequest) => {
      const absPath = join(request.context, request.referencePathName);

      return isDirectory({ fs, absPath }).pipe(
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
        ),
        // when request not directory, or no indexes declared, just pass through
        defaultIfEmpty(request)
      );
    })
  );
}

export interface NodeDirectoryOptions {
  paths: string[];
  fs: FileSystem;
}

/**
 * only speard search paths when request channel == Node, filter joined path which not directory
 *
 * leave empty when paths is empty
 */
export function spreadNodeDirectory(
  options: NodeDirectoryOptions
): OperatorFunction<NormalRequest, NormalRequest> {
  const { fs, paths } = options;

  return pipe(
    // use concatMap to spread directory series, limit parallel
    concatMap((request) => {
      if (request.channel === Channel.Node) {
        return from(paths).pipe(
          filter(() => request.channel === Channel.Node),
          filter((path) => isAbsolute(path)),
          concatMap((path) => {
            // determine referenced directory
            const absPath = join(path, request.referenceModuleName);

            return isDirectory({ fs, absPath }).pipe(
              map(() => assign(request, { context: absPath }))
            );
          })
        );
      }

      // just pass through when not Node request
      return of(request);
    })
  );
}
