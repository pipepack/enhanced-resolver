/**
 * @description - directory related operators
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, from, concat, of } from 'rxjs';
import { concatMap, filter, first, map } from 'rxjs/operators';
import { join, isAbsolute } from 'path';
import type { OperatorFunction } from 'rxjs';

// internal
import { is } from './is';

// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest, ModuleRequest } from '../interface/resolver';
import { Identity } from '../constant';

export interface DirectoryIndexOptions {
  indexes: string[];
  fs: FileSystem;
}

/**
 * expand possible index filename when probe directory, pass through when not
 */
export function useDirectoryIndex(
  options: DirectoryIndexOptions
): OperatorFunction<NormalRequest, NormalRequest> {
  const { fs, indexes } = options;

  return pipe(
    concatMap((request: NormalRequest) => {
      const absPath = join(request.context, request.referencePathName);

      return concat(
        is({ fs, absPath }).pipe(
          filter((identity) => identity === Identity.Directory),
          // improve readability only
          first(),
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

export interface DirectoryModuleOptions {
  paths: string[];
  fs: FileSystem;
}

/**
 * change working directory into npm module directory when import npm module, pass through otherwise
 */
export function useDirectoryModule(
  options: DirectoryModuleOptions
): OperatorFunction<ModuleRequest, ModuleRequest> {
  const { fs, paths } = options;

  return pipe(
    // use concatMap to locate directory series, limit parallel
    concatMap((request) =>
      from(paths).pipe(
        filter((path) => isAbsolute(path)),
        concatMap((path) => {
          const absPath = join(path, request.referenceModuleName);

          return is({ fs, absPath }).pipe(
            filter((identity) => identity === Identity.File),
            map(() => {
              const payload: ModuleRequest = {
                ...request,
                // change relative working directory
                context: absPath,
              };

              return payload;
            })
          );
        }),
        // care about first match directory
        first()
      )
    )
  );
}
