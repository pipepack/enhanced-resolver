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
import { pickNodeFlavor, NodeFlavorOptions } from './operators/npm';

//
export type ModuleResolverOptions = DirectoryIndexOptions &
  ProbeOptions &
  ExtensionOptions &
  NodeFlavorOptions &
  NodeDirectoryOptions;

export class ModuleResolver implements Resolver {
  constructor(private options: ModuleResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const { fs, indexes, fields, paths, extensions } = this.options;
    const pipeline$ = of(material).pipe(
      parse(),
      // spread node module search absolute paths
      spreadNodeDirectory({
        fs,
        paths,
      }),
      // the most important part of the stream
      pickNodeFlavor({ fs, fields }),
      // resolve directory
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
