// package
import { OperatorFunction, pipe, iif, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

// internal
import { possible as _possible } from '../observable/possible';
import { Channel } from '../utils/constant';

// type
import type { FileSystem } from '../interface/fs';
import type { NormalRequest } from '../interface/resolver';

export function possible(
  fs: FileSystem,
  modules: string[]
): OperatorFunction<NormalRequest, NormalRequest> {
  return pipe(
    // use concatMap to spread directory series, limit parallel
    concatMap((request) =>
      iif(
        () => request.channel !== Channel.Node,
        // when reference not node module, just pass through
        of(request),
        // when reference consider as node module, spread possible contexts
        _possible(fs, modules, request)
      )
    )
  );
}
