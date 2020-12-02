/**
 * @description - resolve relative module only
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { of } from 'rxjs';
// internal
import { parse } from './operators/parse';
import { spreadExtension } from './operators/extension';
import { probe } from './operators/probe';
import {
  spreadNodeDirectory,
  spreadDirectoryIndex,
} from './operators/directory';
import { Resolver } from './Resolver';
import { promisify } from './utils/promisify';

// types
import type { Material, NormalTerminal } from './interface/resolver';
import type { ProbeOptions } from './operators/probe';
import type { ExtensionOptions } from './operators/extension';
import type {
  NodeDirectoryOptions,
  DirectoryIndexOptions,
} from './operators/directory';

//
export type ModuleResolverOptions = DirectoryIndexOptions &
  ProbeOptions &
  ExtensionOptions &
  NodeDirectoryOptions;

export class ModuleResolver implements Resolver {
  constructor(private options: ModuleResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const { fs, indexes, paths, extensions } = this.options;
    const pipeline$ = of(material).pipe(
      parse(),
      spreadNodeDirectory({
        fs,
        paths,
      }),
      spreadDirectoryIndex({
        fs,
        indexes,
      }),
      spreadExtension({ extensions }),
      probe({ fs })
    );

    return promisify(pipeline$);
  }
}
