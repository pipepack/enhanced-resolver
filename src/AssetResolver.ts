// package
import { of } from 'rxjs';
// internal
import { Resolver } from './Resolver';
import { parse } from './operators/parse';
import { spreadRootDirectory } from './operators/root';
import { probe } from './operators/probe';
import { promisify } from './utils/promisify';

// interface
import type { RootOptions } from './operators/root';
import type { ProbeOptions } from './operators/probe';
import type { Material, NormalTerminal } from './interface/resolver';

// intersection options
export type AssetResolverOptions = RootOptions & ProbeOptions;

export class AssetResolver implements Resolver {
  constructor(private options: AssetResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const { roots, fs } = this.options;
    const pipeline$ = of(material).pipe(
      parse(),
      spreadRootDirectory({ roots }),
      probe({ fs })
    );

    return promisify(pipeline$);
  }
}
