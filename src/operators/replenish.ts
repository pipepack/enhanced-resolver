/**
 * @description - fill complete file extension
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, OperatorFunction } from 'rxjs';
import { concatMap } from 'rxjs/operators';

// internal
import { replenish as _replenish } from '../observable/replenish';

// type
import type { NormalRequest } from '../interface/resolver';

export function replenish(
  extensions: string[]
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(
    concatMap((request: NormalRequest) => _replenish(request, extensions))
  );
}
