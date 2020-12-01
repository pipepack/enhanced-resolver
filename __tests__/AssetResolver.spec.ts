// package
import { resolve, relative } from 'path';
import { promises } from 'fs';
// internal
import { AssetResolver } from '../src/AssetResolver';
import { FileSystem } from '../src/interface/fs';
import { Material } from '../src/interface/resolver';

describe('Asset Resolver', () => {
  const fs: FileSystem = {
    stat(path) {
      return promises.stat(path);
    },
    readFile(path) {
      return promises.readFile(path);
    },
  };

  it('should fullfil relative request', async () => {
    const m: Material = {
      context: __dirname,
      referencePath: './__fixture__/asset/wolf.jpg',
    };
    const resolver = new AssetResolver({
      fs,
      roots: [],
    });

    const terminal = await resolver.resolve(m);
    const readable = relative(__dirname, terminal.absPath);

    expect(readable).toEqual('__fixture__/asset/wolf.jpg');
  });

  it('should fullfil absolute request', async () => {
    const m: Material = {
      context: __dirname,
      referencePath: '/wolf-native.jpg',
    };

    const resolver = new AssetResolver({
      fs,
      roots: [
        resolve(__dirname, '__fixture__/asset/local'),
        resolve(__dirname, '__fixture__/asset/cloud'),
        resolve(__dirname, '__fixture__/asset/native'),
      ],
    });

    const terminal = await resolver.resolve(m);
    const readable = relative(__dirname, terminal.absPath);

    expect(readable).toEqual('__fixture__/asset/native/wolf-native.jpg');
  });

  it('should reject when no match', () => {
    const m: Material = {
      context: __dirname,
      referencePath: './unknown.png',
    };
    const resolver = new AssetResolver({
      fs,
      roots: [],
    });

    // default empty error
    expect(resolver.resolve(m)).rejects.toBeInstanceOf(Error);
  });
});
