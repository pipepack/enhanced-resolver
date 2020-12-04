/**
 * @description - parse original reference path, split pathname, query, hash extra
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// package
import { pipe, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { URL } from 'url';
// internal
import { Channel } from '../utils/constant';
// type
import type {
  Material,
  NormalRequest,
  ReferencePathNode,
  ReferencePathNormal,
} from '../interface/resolver';

/**
 * @description - only run within *Nix environment
 */
function parseChannel(referencePath: string): Channel {
  const head = referencePath.charAt(0);

  switch (head) {
    case '.':
      return Channel.Relative;
    case '/':
      return Channel.Absolute;
    case '#':
      return Channel.Internal;
    // already assume import reference pass lint
    case '@':
      return Channel.Node;
    // leave it to developer to parse extra scenario
    default:
      return /[a-z]/.test(head) ? Channel.Node : Channel.Unknown;
  }
}

/**
 * @description - split extra hash, query part
 */
function parseIdentity(referencePath: string): ReferencePathNormal {
  // just convert file path into url path to extract search and fragment
  const url = new URL(referencePath, 'https://github.com');
  const referencePathMeta = {
    channel: parseChannel(referencePath),
    referencePathName: referencePath
      .replace(url.search, '')
      .replace(url.hash, ''),
    referencePathQuery: url.search.replace(/^\?/, ''),
    referencePathFragment: url.hash.replace(/^#/, ''),
  };

  return referencePathMeta;
}

// just avoid unnecessary type infer
// function parseModuleStatic(): ReferencePathNode {
//   return {
//     referenceModuleName: '',
//     referenceModuleSubpath: '',
//   };
// }

// parse node module name into parts
export function parseModule(name: string): ReferencePathNode {
  const regexp = {
    normal: /^([^/@]+)(?:\/([^@]+))?/,
    scoped: /^(@[^/]+\/[^/@]+)(?:\/([^@]+))?/,
  };

  const [, referenceModuleName, referenceModuleSubpath] = name.startsWith('@')
    ? (regexp.scoped.exec(name) as RegExpExecArray)
    : (regexp.normal.exec(name) as RegExpExecArray);
  const payload: ReferencePathNode = {
    referenceModuleName,
    referenceModuleSubpath: referenceModuleSubpath || '',
  };

  return payload;
}

export function parse(): OperatorFunction<Material, NormalRequest> {
  return pipe(
    map((m: Material) => {
      const meta = parseIdentity(m.referencePath);

      return { ...meta, ...m };
    })
  );
}
