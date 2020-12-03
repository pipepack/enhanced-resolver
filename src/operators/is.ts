/**
 * @description - creation operator, detect specific path is directory, pass through when yes, transparent when no
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { Observable } from 'rxjs';

// internal
import { Identity } from '../utils/constant';

// types
import type { FileSystem } from '../interface/fs';

export interface ProbeOptions {
  fs: FileSystem;
  absPath: string;
}

export function is(options: ProbeOptions): Observable<Identity> {
  const { fs, absPath } = options;

  return new Observable((subscriber) => {
    fs.stat(absPath)
      .then((stat) => {
        if (stat.isDirectory()) {
          // push directory identity
          subscriber.next(Identity.Directory);
        }

        if (stat.isFile()) {
          // push file identity
          subscriber.next(Identity.File);
        }

        // just complete within finally callback in rest scenario
      })
      .catch(() => {
        // ignore influence on pipe, maybe better logger here
      })
      .finally(() => {
        subscriber.complete();
      });
  });
}

// export function isFileAlias<T>(options: ProbeOptions): OperatorFunction<T, T> {
//   return pipe(
//     concatMap((request))
//   )
// }
// pass through when absPath is File
export function isFile<T>(
  fs: FileSystem,
  absPath: string,
  payload: T
): Observable<T> {
  return new Observable((subscriber) => {
    fs.stat(absPath)
      .then((stat) => {
        if (stat.isFile()) {
          // push directory identity
          subscriber.next(payload);
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

export function isDirectory<T>(
  fs: FileSystem,
  absPath: string,
  payload: T
): Observable<T> {
  return new Observable((subscriber) => {
    fs.stat(absPath)
      .then((stat) => {
        if (stat.isDirectory()) {
          // push directory identity
          subscriber.next(payload);
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

/* type guard */

/* better readability */
// export function isFile(options: ProbeOptions): Observable<Identity.File> {
//   return is(options).pipe(filter(isFileIdentity));
// }

// export function isDirectory(
//   options: ProbeOptions
// ): Observable<Identity.Directory> {
//   return is(options).pipe(filter(isDirectoryIdentity));
// }
