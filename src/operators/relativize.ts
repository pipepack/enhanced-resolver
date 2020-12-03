/**
 * @description - convert absolute reference path into relative path with another context
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, of, from, OperatorFunction } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { isAbsolute } from 'path';

// internal
import { NormalRequest } from '../interface/resolver';
import { Channel } from '../utils/constant';
import { assign } from '../utils/assign';

// convert absolute material into relative based on pass-in root options
export function relativize(
  // root candicate means absolute path
  roots: string[]
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(
    concatMap((request) => {
      if (request.channel === Channel.Absolute) {
        return from(roots).pipe(
          filter((context) => isAbsolute(context)),
          map((context) =>
            assign(request, {
              context,
              channel: Channel.Relative,
              referenceModuleName: request.referencePathName.slice(1),
            })
          )
        );
      }

      // when channel not absolute reference path, just pass through
      return of(request);
    })
  );
}
