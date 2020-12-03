/**
 * @description - resolve relative module only
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { of } from 'rxjs';
// internal
import { Resolver } from './Resolver';
import { parse } from './operators/parse';
import { directory } from './operators/directory';
import { replenish } from './operators/replenish';
import { probe } from './operators/probe';
import { promisify } from './utils/promisify';

// types
import type { FileSystem } from './interface/fs';
import type { Material, NormalTerminal } from './interface/resolver';

export interface RelativeResolverOptions {
  fs: FileSystem;
  // https://webpack.js.org/configuration/resolve/#resolvemainfiles
  mainFiles: string[];
  extensions: string[];
}

export class RelativeResolver implements Resolver {
  constructor(private options: RelativeResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const { fs, mainFiles, extensions } = this.options;

    const pipeline$ = of(material).pipe(
      parse(),
      // resolve directory index
      directory(fs, mainFiles),
      // replenish missing extension
      replenish(extensions),
      // only care about file match
      probe(fs)
    );

    return promisify(pipeline$);
  }
}
