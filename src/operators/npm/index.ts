/**
 * @description - implement npm module resolve
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import type { OperatorFunction } from 'rxjs';
// internal
import { possible } from './possible';
import { transform } from './transform';
import { description } from './description';
import { Channel } from '../../utils/constant';
// types
import type { NormalRequest } from '../../interface/resolver';
import type { FileSystem } from '../../interface/fs';

export interface NPMOptions {
  fs: FileSystem;
  // https://webpack.js.org/configuration/resolve/#resolvemodules
  modules: string[];
  // https://webpack.js.org/configuration/resolve/#resolvemainfields
  mainFields: string[];
  // https://webpack.js.org/configuration/resolve/#resolvedescriptionfiles
  descriptionFiles: string[];
}

/**
 * assume package must have description file like `package.json`, which differentiate from standard for now
 */
export function npm(
  options: NPMOptions
): OperatorFunction<NormalRequest, NormalRequest> {
  const { fs, mainFields, descriptionFiles, modules } = options;

  return pipe(
    concatMap((request) => {
      if (request.channel === Channel.Node) {
        return of(request).pipe(
          // spread possible directory when necessary
          possible(fs, modules),
          // parse package description file, assume have description file for sure
          description(fs, descriptionFiles),
          // determine final subpath
          transform(fs, mainFields)
        );
      }

      return of(request);
    })
  );
}
