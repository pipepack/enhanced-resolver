/**
 * @description - detect first exist file
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { join } from 'path';
import { Observable, pipe } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';
import type { OperatorFunction } from 'rxjs';

// internal
import type { FileSystem } from '../interface/fs';
import type { Request, Terminal } from '../interface/resolver';

export interface ProbeOptions {
  fs: FileSystem;
}

// TODO - parrallel managerment
export function probe(
  options: ProbeOptions
): OperatorFunction<Request, Terminal> {
  return pipe(
    concatMap(
      (request) =>
        new Observable<Terminal>((subscriber) => {
          const { fs } = options;
          const absPath = join(request.context, request.referencePathName);

          fs.stat(absPath)
            .then((stat) => {
              if (stat.isFile()) {
                // any other extra properties here within the future
                const extra = { absPath };
                // explicit type description
                const payload: Terminal = { ...request, ...extra };

                // push expected terminal payload
                subscriber.next(payload);
              }
            })
            .catch((err) => {
              // ignore influence on pipe, maybe better logger here
            })
            .finally(() => {
              subscriber.complete();
            });
        })
    ),
    first()
  );
}
