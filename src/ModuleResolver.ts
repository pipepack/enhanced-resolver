/**
 * @description - resolve relative module only
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { of } from 'rxjs';
// internal
import { parseReferencePath } from './operators/parse';
import { fill } from './operators/fill';
import { probe } from './operators/probe';
import { useDirectoryIndex } from './operators/directory';
import { Resolver } from './Resolver';
import { promisify } from './utils/promisify';

// types
import type { Material, NormalTerminal } from './interface/resolver';
import type { ProbeOptions } from './operators/probe';
import type { FillOptions } from './operators/fill';
import type { DirectoryIndexOptions } from './operators/directory';

//
export type ModuleResolverOptions = DirectoryIndexOptions &
  ProbeOptions &
  FillOptions;

export class ModuleResolver implements Resolver {
  constructor(private options: ModuleResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const { fs, indexes, extensions } = this.options;
    const pipeline$ = of(material).pipe(
      parseReferencePath(),
      useDirectoryIndex({
        fs,
        indexes,
      }),
      fill({
        extensions,
      }),
      probe({
        fs,
      })
    );

    return promisify(pipeline$);
  }
}
