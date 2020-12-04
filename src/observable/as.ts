// package
import { join } from 'path';
import { of, from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

// internal
import { isDirectory } from './is';
import { pickDescriptionFile, pickMainField } from './description-file';
import { assign } from '../utils/assign';

// types
import type {
  NormalRequest,
  RelativeResolverOptions,
} from '../interface/resolver';

/**
 * consider request as file, just pass through, for convenience
 */
export function asFile(request: NormalRequest): Observable<NormalRequest> {
  return of(request);
}

/**
 * condier request as standalone module, which means search by description file
 */
export type AsModuleOptions = Pick<
  RelativeResolverOptions,
  'fs' | 'descriptionFiles' | 'mainFields'
>;
export function asModule(
  request: NormalRequest,
  options: AsModuleOptions
): Observable<NormalRequest> {
  const { fs, descriptionFiles, mainFields } = options;

  return pickDescriptionFile(request, fs, descriptionFiles).pipe(
    concatMap((descriptions) =>
      pickMainField(request, descriptions, mainFields)
    )
  );
}

/**
 * consider request as directory, spread indexes
 */
export type AsDirectoryOptions = Pick<
  RelativeResolverOptions,
  'fs' | 'mainFiles'
>;

export function asDirectory(
  request: NormalRequest,
  options: AsDirectoryOptions
): Observable<NormalRequest> {
  const { fs, mainFiles } = options;

  return isDirectory(request, fs).pipe(
    concatMap(() =>
      from(mainFiles).pipe(
        map((mainFile) =>
          assign(request, {
            referencePathName: join(request.referencePathName, mainFile),
          })
        )
      )
    )
  );
}
