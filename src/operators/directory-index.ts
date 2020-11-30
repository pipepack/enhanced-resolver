/**
 * @description - detect relative module directory reference path
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { join } from 'path';

// types
import type { OperatorFunction } from 'rxjs';
import type { FileSystem } from '../interface/fs';
import type { Request } from '../interface/resolver';

export interface DirectoryIndexOptions {
  indexFiles: string[];
  fs: FileSystem;
}

export function directoryIndex(
  options: DirectoryIndexOptions
): OperatorFunction<Request, Request> {
  return pipe(
    concatMap(
      (request: Request) =>
        new Observable<Request>((subscriber) => {
          const { fs, indexFiles } = options;
          const absPath = join(request.context, request.referencePathName);

          fs.stat(absPath)
            .then((stat) => {
              if (stat.isDirectory()) {
                indexFiles.forEach((indexFile) => {
                  const payload: Request = {
                    ...request,
                    context: absPath,
                    referencePathName: indexFile,
                    // truncate original params
                    referencePathQuery: '',
                    referencePathFragment: '',
                  };

                  subscriber.next(payload);
                });
              } else {
                // transparently pass request
                subscriber.next(request);
              }
            })
            .catch(() => {
              // ignore influence on pipe, maybe better logger here
            })
            .finally(() => {
              subscriber.complete();
            });
        })
    )
  );
}
