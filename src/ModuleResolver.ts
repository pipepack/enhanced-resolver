/**
 * @description - resolve relative module only
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { of } from 'rxjs';
// internal
import { parse } from './operators/parse';
import { replenish } from './operators/replenish';
import { probe } from './operators/probe';
import { directory } from './operators/directory';
import { npm } from './operators/npm';
import { promisify } from './utils/promisify';
import { Resolver } from './Resolver';

// types
import type { Material, NormalTerminal } from './interface/resolver';
import type { NPMOptions } from './operators/npm';
import type { FileSystem } from './interface/fs';

export interface ModuleResolverOptions extends NPMOptions {
  fs: FileSystem;
  indexes: string[];
  extensions: string[];
}

export class ModuleResolver implements Resolver {
  constructor(private options: ModuleResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const {
      fs,
      indexes,
      extensions,
      paths,
      mainFields,
      descriptionFiles,
    } = this.options;

    const pipeline$ = of(material).pipe(
      parse(),
      npm({
        fs,
        paths,
        mainFields,
        descriptionFiles,
      }),
      // resolve directory index
      directory(fs, indexes),
      // replenish missing extension
      replenish(extensions),
      probe(fs)
    );

    return promisify(pipeline$);
  }
}
