/**
 * @description - creation operator, detect specific path is directory or file, pass through when yes, transparent when no
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { Observable } from 'rxjs';

// internal
import { Identity } from '../utils/constant';

// types
import type { FileSystem } from '../interface/fs';

// filter absolute path directly
export function isAlias<T>(
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

export function isAliasDirectory<T>(
  fs: FileSystem,
  absPath: string,
  payload: T
): Observable<T> {
  return isAlias(fs, absPath, Identity.Directory, payload);
}

export function isAliasFile<T>(
  fs: FileSystem,
  absPath: string,
  payload: T
): Observable<T> {
  return isAlias(fs, absPath, Identity.File, payload);
}
