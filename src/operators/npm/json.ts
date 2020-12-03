// package
import { Observable } from 'rxjs';
// type
import type { FileSystem } from '../../interface/fs';

/**
 * use natural reject as failure of getting package.json
 */
export function json<T extends Record<string, unknown>>(
  fs: FileSystem,
  absDescriptionFile: string
): Observable<T> {
  return new Observable((subscriber) => {
    fs.readFile(absDescriptionFile)
      .then((bf) => bf.toString())
      .then((content) => JSON.parse(content) as T)
      .then((content) => {
        subscriber.next(content);
      })
      .catch(() => {
        // silent
      })
      .finally(() => {
        subscriber.complete();
      });
  });
}
