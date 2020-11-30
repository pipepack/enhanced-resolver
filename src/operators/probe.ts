/**
 * @description - detect first exist file
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { join } from 'path';
import { pipe } from 'rxjs';
import { concatMap, filter, first, map } from 'rxjs/operators';
import type { OperatorFunction } from 'rxjs';

// internal
import { is } from './is';
import { Identity } from '../constant';

// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest, NormalTerminal } from '../interface/resolver';

export interface ProbeOptions {
  fs: FileSystem;
}

// TODO - parrallel managerment
export function probe(
  options: ProbeOptions
): OperatorFunction<NormalRequest, NormalTerminal> {
  return pipe(
    concatMap((request) => {
      const { fs } = options;
      const absPath = join(request.context, request.referencePathName);

      // is() observable emit only once, so first operator not necessary here
      return is({ fs, absPath }).pipe(
        filter((identity) => identity === Identity.File),
        map(() => {
          // any other extra properties here within the future
          const extra = { absPath };
          // explicit type description
          const payload: NormalTerminal = { ...request, ...extra };

          return payload;
        })
      );
    }),
    // unsubscribe as early as possible, avoid unnecessary file probe here
    first()
  );
}
