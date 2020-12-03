/**
 * @description - use description content to transform reference subpath
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { Observable, OperatorFunction, pipe } from 'rxjs';
import { concatMap } from 'rxjs/operators';

// internal
import { json } from './json';
import { assign } from '../../utils/assign';
import { Channel } from '../../utils/constant';

// type
import { FileSystem } from '../../interface/fs';
import {
  NormalRequest,
  NormalRequestWithDescriptionFile,
} from '../../interface/resolver';

export function transformFromDescriptions(
  request: NormalRequest,
  descriptions: Record<string, unknown>,
  mainFields: string[]
): Observable<NormalRequest> {
  return new Observable<NormalRequest>((subscriber) => {
    // TODO - 1. transform subpath when exports field exist
    // 2. pass through original request when have explicit subpath
    if (request.referenceModuleSubpath) {
      subscriber.next(
        assign(request, {
          channel: Channel.Relative,
          referencePathName: request.referenceModuleSubpath,
        })
      );
    }
    // 3. pick package main file
    else {
      const field = mainFields.find(
        (mainField) => typeof descriptions[mainField] === 'string'
      );

      if (field) {
        subscriber.next(
          assign(request, {
            channel: Channel.Relative,
            referencePathName: descriptions[field] as string,
          })
        );
      }
    }
    // 4. fallback empty
    subscriber.complete();
  });
}

export function transform(
  fs: FileSystem,
  mainFields: string[]
): OperatorFunction<NormalRequestWithDescriptionFile, NormalRequest> {
  return pipe(
    concatMap((request) =>
      // 1. extract description content
      json(fs, request.absDescriptionFile).pipe(
        concatMap((descriptions) =>
          transformFromDescriptions(request, descriptions, mainFields)
        )
      )
    )
  );
}
