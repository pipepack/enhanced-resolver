/**
 * @description - detect first exist file
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { join } from 'path';
import { pipe } from 'rxjs';
import { map, first } from 'rxjs/operators';
import type { OperatorFunction } from 'rxjs';

// internal
import { isFile } from './is';

// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest, NormalTerminal } from '../interface/resolver';

export function probe(
  fs: FileSystem
): OperatorFunction<NormalRequest, NormalTerminal> {
  return pipe(
    // only care about file
    isFile(fs),
    // unsubscribe as early as possible, avoid unnecessary file probe here
    first(),
    // splice into terminal structure
    map<NormalRequest, NormalTerminal>((request) => ({
      ...request,
      absPath: join(request.context, request.referencePathName),
    }))
  );
}
