/**
 * @description - detect first exist file
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { join } from 'path';
import { pipe } from 'rxjs';
import { concatMap, first, map } from 'rxjs/operators';
import type { OperatorFunction } from 'rxjs';

// internal
import { isFile } from './is';

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
      return isFile({ fs, absPath }).pipe(
        map<unknown, NormalTerminal>(() => ({ ...request, absPath }))
      );
    }),
    // unsubscribe as early as possible, avoid unnecessary file probe here
    first()
  );
}
