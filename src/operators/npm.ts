/**
 * @description - implement npm module resolve
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { join } from 'path';
import { Observable, of, pipe } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import type { OperatorFunction } from 'rxjs';
// internal
import { Channel } from '../utils/constant';
import { assign } from '../utils/assign';
// types
import type { NormalRequest, PKG } from '../interface/resolver';
import type { FileSystem } from '../interface/fs';

export interface NodeFlavorOptions {
  fs: FileSystem;
  // entry fileds would like to use
  fields: string[];
}

export interface ParseJSONOptions {
  fs: FileSystem;
  absPath: string;
}

/**
 * use natural reject as failure of getting package.json
 */
async function parseJSON<T extends PKG>(options: ParseJSONOptions): Promise<T> {
  const { fs, absPath } = options;

  const bf = await fs.readFile(absPath);

  return JSON.parse(bf.toString()) as T;
}

/**
 * complicated scenario, consider extension later
 */
export function pickNodeFlavor(
  options: NodeFlavorOptions
): OperatorFunction<NormalRequest, NormalRequest> {
  const { fs, fields } = options;

  return pipe(
    concatMap((request) => {
      // 1. if request not node request, just pass through
      if (request.channel !== Channel.Node) {
        return of(request);
      }

      // 2. detect package.json existance
      return new Observable<NormalRequest>((subscriber) => {
        parseJSON({ fs, absPath: join(request.context, 'package.json') })
          // 2. use package.json field to transform reference subpath
          .then((pkg) => {
            // 2.1 infer implicit subpath or transform subpath, only when exports, alias browser field exist
            // 2.2 use explicit subpath
            if (request.referenceModuleSubpath.length > 0) {
              subscriber.next(
                assign(request, {
                  channel: Channel.Relative,
                  // subsequent operator doesn't care about module info
                  referencePathName: request.referenceModuleSubpath,
                })
              );
            }
            // 2.3 use main field, only when no prior converter
            else if (request.referenceModuleSubpath.length === 0) {
              const match = fields.find(
                (field) => pkg[field] && typeof pkg[field] === 'string'
              );

              if (match) {
                subscriber.next(
                  assign(request, {
                    channel: Channel.Relative,
                    referencePathName: pkg[match] as string,
                  })
                );
              }
            }
          })
          .catch(() => {
            // 3. when package.json considered not exist, try direct subpath
            if (request.referenceModuleSubpath.length > 0) {
              subscriber.next(
                assign(request, {
                  channel: Channel.Relative,
                  context: join(
                    request.context,
                    request.referenceModuleSubpath
                  ),
                })
              );
            }
          })
          // 4. complete stream
          .finally(() => {
            subscriber.complete();
          });
      });
    })
  );
}
