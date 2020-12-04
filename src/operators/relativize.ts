/**
 * @description - convert absolute reference path into relative path with another context
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, of, from, iif, OperatorFunction } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { isAbsolute } from 'path';

// internal
import { Channel } from '../utils/constant';
import { assign } from '../utils/assign';

// types
import type { NormalRequest } from '../interface/resolver';

export function relativize(
  // root candicate means absolute path
  roots: string[]
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(
    concatMap((request) =>
      iif(
        // filter absolute reference path
        () => request.channel !== Channel.Absolute,
        // pass through when not absolute reference path
        of(request),
        // convert absolute reference path into relative
        from(roots).pipe(
          filter((context) => isAbsolute(context)),
          map((context) =>
            assign(request, {
              context,
              channel: Channel.Relative,
              referencePathName: request.referencePathName.slice(1),
            })
          )
        )
      )
    )
  );
}
