/**
 * @description - implement npm module resolve
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { merge, OperatorFunction, pipe } from 'rxjs';
import { concatMap } from 'rxjs/operators';
// internal
import { fromPKG, PKGOptions } from './pkg';
import { fromDirectSubpath } from './subpath';

// types
import type { ModuleRequest } from '../interface/resolver';

export type NodeFlavorOptions = PKGOptions;

export function useNodeFlavor(
  options: NodeFlavorOptions
): OperatorFunction<ModuleRequest, ModuleRequest> {
  return pipe(
    concatMap((request) =>
      // mutually exclusive
      merge(fromPKG(request, options), fromDirectSubpath(request))
    )
  );
}
