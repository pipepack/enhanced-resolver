/**
 * @description - drilldown subpath by package.json
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, OperatorFunction, Observable, of } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';
import { join } from 'path';

// internal

// types
import { PKG, ModuleRequest } from '../interface/resolver';
import { FileSystem } from '../interface/fs';

export interface ParseJSONOptions {
  fs: FileSystem;
  absPath: string;
}

function parseJSON<T extends PKG>(options: ParseJSONOptions) {
  const { fs, absPath } = options;

  return new Observable<T>((subscriber) => {
    fs.readFile(absPath)
      .then((bf) => bf.toString())
      .then((raw) => JSON.parse(raw))
      .then((json) => {
        subscriber.next(json as T);
      })
      .catch(() => {
        // silent error
      })
      .finally(() => {
        subscriber.complete();
      });
  });
}

export interface ComposeJSONOptions {
  pkg: PKG;
  fields: string[];
  request: ModuleRequest;
}

/**
 * spread possible fields
 */
function composeJSON(options: ComposeJSONOptions): Observable<ModuleRequest> {
  const { request, pkg, fields } = options;

  return new Observable((subscriber) => {
    // spread fields
    fields.forEach((field) => {
      // TODO - need better implement here
      switch (field) {
        case 'main':
          if (pkg.main) {
            subscriber.next({
              ...request,
              pkg,
              referencePathName: pkg.main,
            });
          }
          break;
        case 'module':
          if (pkg.module) {
            subscriber.next({
              ...request,
              pkg,
              referencePathName: pkg.module,
            });
          }
          break;
        case 'browser':
          if (pkg.browser) {
            subscriber.next({
              ...request,
              pkg,
              referencePathName: pkg.browser,
            });
          }
          break;
        default:
        // empty here
      }
    });

    // complete spread fields
    subscriber.complete();
  });
}

export interface PKGOptions {
  fs: FileSystem;
  // entry fileds would like to use
  fields: string[];
}

/**
 * spread main fields when pkg exist, pass through otherwise
 *
 * in scenario without subpath:
 *
 * import anything from 'module';
 */
export function usePKG(
  options: PKGOptions
): OperatorFunction<ModuleRequest, ModuleRequest> {
  const { fs, fields } = options;

  // assume context means expected directory, skip rest requests
  return pipe(
    filter((request) => request.referenceModuleSubPath.length === 0),
    // for every incoming request, try parse file as json, not exist, or not json means implicit empty
    concatMap((request) =>
      parseJSON({ fs, absPath: join(request.context, 'package.json') }).pipe(
        // for every incoming pkg, spread fields
        concatMap((pkg) =>
          composeJSON({
            request,
            pkg,
            fields,
          })
        )
      )
    )
  );
}

export function fromPKG(
  request: ModuleRequest,
  options: PKGOptions
): Observable<ModuleRequest> {
  return of(request).pipe(usePKG(options));
}
