/**
 * @description - creation operator, detect specific path is directory, pass through when yes, transparent when no
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { Observable } from 'rxjs';

// internal
import { Identity } from '../constant';

// types
import type { FileSystem } from '../interface/fs';

export interface DirectoryProbeOptions {
  fs: FileSystem;
  absPath: string;
}

export function is(options: DirectoryProbeOptions): Observable<Identity> {
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
