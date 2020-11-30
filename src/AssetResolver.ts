// package
import { of } from 'rxjs';
// internal
import { Resolver } from './Resolver';
import { parse } from './operators/parse';
import { root } from './operators/root';
import { probe } from './operators/probe';
import { promisify } from './utils/promisify';

// interface
import type { RootOptions } from './operators/root';
import type { ProbeOptions } from './operators/probe';
import type { Material, Terminal } from './interface/resolver';

// intersection options
export type AssetResolverOptions = RootOptions & ProbeOptions;

export class AssetResolver implements Resolver {
  constructor(private options: AssetResolverOptions) {}

  async resolve(material: Material): Promise<Terminal> {
    const { roots, fs } = this.options;
    const pipeline$ = of(material).pipe(
      parse(),
      root({ roots }),
      probe({ fs })
    );

    // TODO - handler error gracefully
    return promisify(pipeline$);
  }
}
