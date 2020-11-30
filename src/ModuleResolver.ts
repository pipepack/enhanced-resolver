/**
 * @description - resolve relative module only
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { of } from 'rxjs';
// internal
import { parse } from './operators/parse';
import { fill } from './operators/fill';
import { probe } from './operators/probe';
import { directoryIndex } from './operators/directory-index';
import { Resolver } from './Resolver';
import { promisify } from './utils/promisify';

// types
import type { Material, Terminal } from './interface/resolver';
import type { ProbeOptions } from './operators/probe';
import type { FillOptions } from './operators/fill';
import type { DirectoryIndexOptions } from './operators/directory-index';

//
export type ModuleResolverOptions = DirectoryIndexOptions &
  ProbeOptions &
  FillOptions;

export class ModuleResolver implements Resolver {
  constructor(private options: ModuleResolverOptions) {}

  async resolve(material: Material): Promise<Terminal> {
    const { fs, indexFiles, extensions } = this.options;
    const pipeline$ = of(material).pipe(
      parse(),
      directoryIndex({
        fs,
        indexFiles,
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
