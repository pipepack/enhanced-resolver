/**
 * @description - detect first exist file
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { join } from 'path';
import { pipe } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';
import type { OperatorFunction } from 'rxjs';

// internal
import { isFile } from './is';

// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest, NormalTerminal } from '../interface/resolver';

// TODO - parrallel managerment
export function probe(
  fs: FileSystem
): OperatorFunction<NormalRequest, NormalTerminal> {
  return pipe(
    concatMap((request) => {
      const absPath = join(request.context, request.referencePathName);

      return isFile(fs, absPath, { ...request, absPath });
    }),
    // unsubscribe as early as possible, avoid unnecessary file probe here
    first()
  );
}
