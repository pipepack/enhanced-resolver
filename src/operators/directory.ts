/**
 * @description - directory related operators
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, from, concat, of } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { join, isAbsolute } from 'path';
import type { OperatorFunction } from 'rxjs';

// internal
import { isDirectory } from './is';

// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest, ModuleRequest } from '../interface/resolver';

export interface DirectoryIndexOptions {
  indexes: string[];
  fs: FileSystem;
}

/**
 * expand possible index filename when probe directory, repush request without extra extension
 */
export function useDirectoryIndex(
  options: DirectoryIndexOptions
): OperatorFunction<NormalRequest, NormalRequest> {
  const { fs, indexes } = options;

  return pipe(
    concatMap((request: NormalRequest) => {
      const absPath = join(request.context, request.referencePathName);

      return concat(
        isDirectory({ fs, absPath }).pipe(
          // any *Map operator consider valid here
          concatMap(() =>
            from(indexes).pipe(
              map((index) => {
                const payload: NormalRequest = {
                  ...request,
                  context: absPath,
                  referencePathName: index,
                  // truncate original params, maybe not necessary
                  referencePathQuery: '',
                  referencePathFragment: '',
                };

                return payload;
              })
            )
          )
        ),
        of(request)
      );
    })
  );
}

export interface PossibleDirectoryOptions {
  paths: string[];
  fs: FileSystem;
}

/**
 * speard search paths, find possible directory which npm module exist
 *
 * leave empty when paths is empty
 */
export function usePossibleDirectory(
  options: PossibleDirectoryOptions
): OperatorFunction<ModuleRequest, ModuleRequest> {
  const { fs, paths } = options;

  return pipe(
    // use concatMap to locate directory series, limit parallel
    concatMap((request) =>
      from(paths).pipe(
        filter((path) => isAbsolute(path)),
        concatMap((path) => {
          // determine referenced directory
          const absPath = join(path, request.referenceModuleName);

          return isDirectory({ fs, absPath }).pipe(
            map(() => {
              const payload: ModuleRequest = {
                ...request,
                // change relative working directory
                context: absPath,
              };

              return payload;
            })
          );
        })
      )
    )
  );
}
