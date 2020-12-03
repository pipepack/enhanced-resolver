// package
import { isAbsolute, join } from 'path';
import { OperatorFunction, pipe, from, of } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';

// internal
import { Channel } from '../../utils/constant';
import { isDirectory } from '../is';

// type
import type { FileSystem } from '../../interface/fs';
import type { NormalRequest } from '../../interface/resolver';

/**
 * only speard search paths when request channel == Node, filter joined path which not directory
 *
 * leave empty when paths is empty
 */
export function possible(
  fs: FileSystem,
  paths: string[]
): OperatorFunction<NormalRequest, NormalRequest> {
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

            return isDirectory(fs, absPath, { ...request, context: absPath });
          })
        );
      }

      // just pass through when not Node request
      return of(request);
    })
  );
}
