/**
 * @description - resolve relative module only
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { concat, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

// internal
import { Resolver } from './Resolver';
import { parse } from './operators/parse';
import { replenish } from './operators/replenish';
import { probe } from './operators/probe';
import { possible } from './operators/possible';
import { asDirectory, asFile, asModule } from './observable/as';
import { promisify } from './utils/promisify';

// types
import type {
  Material,
  NormalTerminal,
  RelativeResolverOptions,
} from './interface/resolver';

export class NodeResolver implements Resolver {
  constructor(private options: RelativeResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const {
      fs,
      mainFiles,
      mainFields,
      descriptionFiles,
      extensions,
      modules,
    } = this.options;

    const pipeline$ = of(material).pipe(
      // parse reference path, split hash and query disturbe
      parse(),
      // spread node module search paths
      possible(fs, modules),
      // implement standard file detection
      concatMap((request) =>
        concat(
          // consider as file
          asFile(request),
          // consider as module, which reference has standalone description file
          asModule(request, { fs, mainFields, descriptionFiles }),
          // consider as directory
          asDirectory(request, { fs, mainFiles })
        )
      ),
      // replenish missing extension
      replenish(extensions),
      // only care about file match
      probe(fs)
    );

    return promisify(pipeline$);
  }
}
