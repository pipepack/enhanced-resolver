/**
 * @description - creation operator, detect specific path is directory, pass through when yes, transparent when no
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { OperatorFunction, pipe } from 'rxjs';
import { concatMap } from 'rxjs/operators';

// internal
import { isFile as _isFile } from '../observable/is';

// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest } from '../interface/resolver';

export function isFile(
  fs: FileSystem
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(concatMap((request) => _isFile(request, fs)));
}
