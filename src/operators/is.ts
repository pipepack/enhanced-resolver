/**
 * @description - creation operator, detect specific path is directory, pass through when yes, transparent when no
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// internal
import { Identity } from '../constant';

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

/* type guard */
function isFileIdentity(identity: Identity): identity is Identity.File {
  return identity === Identity.File;
}

function isDirectoryIdentity(
  identity: Identity
): identity is Identity.Directory {
  return identity === Identity.Directory;
}

/* better readability */
export function isFile(options: ProbeOptions): Observable<Identity.File> {
  return is(options).pipe(filter(isFileIdentity));
}

export function isDirectory(
  options: ProbeOptions
): Observable<Identity.Directory> {
  return is(options).pipe(filter(isDirectoryIdentity));
}
