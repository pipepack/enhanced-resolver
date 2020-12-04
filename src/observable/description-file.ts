// package
import { join } from 'path';
import { from, Observable } from 'rxjs';
import { concatMap, take, filter, map } from 'rxjs/operators';

// internal
import { json } from './json';
import { assign } from '../utils/assign';

// type
import type {
  NormalRequest,
  ModuleDescription,
  RelativeResolverOptions,
} from '../interface/resolver';

/**
 * try to load description file as json, pass through payload, take the highest priority description file
 */
export function pickDescriptionFile(
  request: NormalRequest,
  fs: RelativeResolverOptions['fs'],
  descriptionFiles: RelativeResolverOptions['descriptionFiles']
): Observable<ModuleDescription> {
  return from(descriptionFiles).pipe(
    concatMap((descriptionFile) =>
      json<ModuleDescription>(
        fs,
        join(request.context, request.referencePathName, descriptionFile)
      )
    ),
    // only care about the first match
    take(1)
  );
}

/**
 * compose main field into request
 */
export function pickMainField(
  request: NormalRequest,
  descriptions: ModuleDescription,
  mainFields: string[]
): Observable<NormalRequest> {
  // 1. extract description content
  return from(mainFields).pipe(
    filter((field) => typeof descriptions[field] === 'string'),
    map((field) =>
      assign(request, {
        referencePathName: join(
          request.referencePathName,
          descriptions[field] as string
        ),
      })
    ),
    // take priority main field
    take(1)
  );
}
