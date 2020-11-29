/**
 * @description - execute observable and extract the first
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { Observable } from 'rxjs';

export function promisify<T>(source$: Observable<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const subscription = source$.subscribe({
      next(payload) {
        // complete promise
        resolve(payload);
        // dispose further payload
        subscription.unsubscribe();
      },
      error(error) {
        reject(error);
      },
      // safe operation call reject after resolve
      complete() {
        reject();
      },
    });
  });
}
