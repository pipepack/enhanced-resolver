// package
import { of } from 'rxjs';
// internal
import { Resolver } from './Resolver';
import { parse } from './operators/parse';
import { relativize } from './operators/relativize';
import { probe } from './operators/probe';
import { promisify } from './utils/promisify';

// interface
import type { Material, NormalTerminal } from './interface/resolver';
import { FileSystem } from './interface/fs';

// intersection options
export interface AssetResolverOptions {
  fs: FileSystem;
  // absolute path list
  roots: string[];
}

export class AssetResolver implements Resolver {
  constructor(private options: AssetResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const { roots, fs } = this.options;
    const pipeline$ = of(material).pipe(parse(), relativize(roots), probe(fs));

    return promisify(pipeline$);
  }
}
