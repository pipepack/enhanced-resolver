/**
 * @description - creation operator, detect specific path is directory or file, pass through when yes, transparent when no
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { join } from 'path';
import { Observable } from 'rxjs';

// internal
// internal
import { Identity } from '../utils/constant';
// types
import type { FileSystem } from '../interface/fs';
import type { NormalRequest } from '../interface/resolver';

// filter absolute path directly
export function is<T>(
  fs: FileSystem,
  absPath: string,
  identity: Identity,
  payload: T
): Observable<T> {
  return new Observable((subscriber) => {
    // only care about normal request
    fs.stat(absPath)
      .then((stat) => {
        if (identity === Identity.File && stat.isFile()) {
          subscriber.next(payload);
        } else if (identity === Identity.Directory && stat.isDirectory()) {
          subscriber.next(payload);
        } else {
          // fallback, swallow silently
        }
      })
      .catch(() => {
        // ignore influence on pipe, maybe better logger here
      })
      .finally(() => {
        subscriber.complete();
      });
  });
}

export function isFile<T>(
  fs: FileSystem,
  absPath: string,
  payload: T
): Observable<T> {
  return is(fs, absPath, Identity.File, payload);
}

export function isDirectory<T>(
  fs: FileSystem,
  absPath: string,
  payload: T
): Observable<T> {
  return is(fs, absPath, Identity.Directory, payload);
}

export function isFileRequest(
  request: NormalRequest,
  fs: FileSystem
): Observable<NormalRequest> {
  const { context, referencePathName } = request;
  const absPath = join(context, referencePathName);

  return isFile(fs, absPath, request);
}

export function isDirectoryRequest(
  request: NormalRequest,
  fs: FileSystem
): Observable<NormalRequest> {
  const { context, referencePathName } = request;
  const absPath = join(context, referencePathName);

  return isDirectory(fs, absPath, request);
}
