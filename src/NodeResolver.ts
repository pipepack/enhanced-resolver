/**
 * @description - resolve relative module only
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { of } from 'rxjs';
// internal
import { parseReferencePath, parseReferenceModule } from './operators/parse';
import { fill } from './operators/fill';
import { probe } from './operators/probe';
import { useDirectoryIndex, usePossibleDirectory } from './operators/directory';
import { NodeFlavorOptions, useNodeFlavor } from './operators/npm';
import { Resolver } from './Resolver';
import { promisify } from './utils/promisify';
// types
import type { Material, NormalTerminal } from './interface/resolver';
import type { ProbeOptions } from './operators/probe';
import type { FillOptions } from './operators/fill';
import type {
  DirectoryIndexOptions,
  PossibleDirectoryOptions,
} from './operators/directory';

export type NodeResolverOptions = PossibleDirectoryOptions &
  DirectoryIndexOptions &
  NodeFlavorOptions &
  ProbeOptions &
  FillOptions;

export class NodeResolver implements Resolver {
  constructor(private options: NodeResolverOptions) {}

  async resolve(material: Material): Promise<NormalTerminal> {
    const { fs, paths, indexes, fields, extensions } = this.options;
    const pipeline$ = of(material).pipe(
      /* parse */
      parseReferencePath(),
      parseReferenceModule(),
      /* core implementation */
      // spread possible search paths, allow empty which means search quit early
      usePossibleDirectory({ fs, paths }),
      // spread possible specific fs path
      useNodeFlavor({ fs, fields }),
      // spread directory referencePath
      useDirectoryIndex({ fs, indexes }),
      /* probe */
      fill({ extensions }),
      probe({ fs })
    );

    return promisify(pipeline$);
  }
}
