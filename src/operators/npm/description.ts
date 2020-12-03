// package
import { join } from 'path';
import { from, OperatorFunction, pipe } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
// internal
import { isFile } from '../is';

// type
import type { FileSystem } from '../../interface/fs';
import type {
  NormalRequest,
  NormalRequestWithDescriptionFile,
} from '../../interface/resolver';

// find description file within context
export function description(
  fs: FileSystem,
  descriptionFiles: string[]
): OperatorFunction<NormalRequest, NormalRequestWithDescriptionFile> {
  // package without description file allowed, just pass through
  return pipe(
    concatMap((request) =>
      from(descriptionFiles).pipe(
        concatMap((descriptionFile) => {
          const absDescriptionFile = join(request.context, descriptionFile);
          const payload = {
            ...request,
            absDescriptionFile: join(request.context, descriptionFile),
          };

          return isFile<NormalRequestWithDescriptionFile>(
            fs,
            absDescriptionFile,
            payload
          );
        }),
        // only care about the first match
        take(1)
      )
    )
  );
}
