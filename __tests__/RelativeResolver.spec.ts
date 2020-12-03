// package
import { relative } from 'path';
import { promises } from 'fs';
// internal
import { RelativeResolver } from '../src/RelativeResolver';
import { FileSystem } from '../src/interface/fs';
import { Material } from '../src/interface/resolver';

describe('Relative Module Resolver', () => {
  const fs: FileSystem = {
    stat(path) {
      return promises.stat(path);
    },
    readFile(path) {
      return promises.readFile(path);
    },
  };

  it('should consider original extension as highest priority', async () => {
    const m: Material = {
      context: __dirname,
      referencePath: './__fixture__/extension/assign.js',
    };
    const resolver = new RelativeResolver({
      fs,
      mainFiles: [],
      extensions: ['.ts', '.mjs', '.js'],
    });
    const terminal = await resolver.resolve(m);
    const readable = relative(__dirname, terminal.absPath);

    expect(readable).toEqual('__fixture__/extension/assign.js');
  });

  it('should fullfil missing extension', async () => {
    const m: Material = {
      context: __dirname,
      referencePath: './__fixture__/extension/assign',
    };
    const resolver1 = new RelativeResolver({
      fs,
      mainFiles: [],
      extensions: ['.ts', '.mjs', '.js'],
    });
    const resolver2 = new RelativeResolver({
      fs,
      mainFiles: [],
      extensions: ['.mjs', '.js', '.ts'],
    });

    const terminal1 = await resolver1.resolve(m);
    const readable1 = relative(__dirname, terminal1.absPath);

    expect(readable1).toEqual('__fixture__/extension/assign.ts');

    const terminal2 = await resolver2.resolve(m);
    const readable2 = relative(__dirname, terminal2.absPath);

    expect(readable2).toEqual('__fixture__/extension/assign.mjs');
  });

  it('should fullfil directory indexes', async () => {
    const m: Material = {
      context: __dirname,
      referencePath: './__fixture__/directory',
    };
    const resolver1 = new RelativeResolver({
      fs,
      extensions: ['.ts'],
      mainFiles: ['index.wechat', 'index.alipay', 'index'],
    });

    const terminal1 = await resolver1.resolve(m);
    const readable1 = relative(__dirname, terminal1.absPath);

    expect(readable1).toEqual('__fixture__/directory/index.wechat.ts');

    const resolver2 = new RelativeResolver({
      fs,
      extensions: ['.ts'],
      mainFiles: ['index.alipay', 'index.wechat', 'index'],
    });

    const terminal2 = await resolver2.resolve(m);
    const readable2 = relative(__dirname, terminal2.absPath);

    expect(readable2).toEqual('__fixture__/directory/index.alipay.ts');
  });

  it('should reject when no match', () => {
    const m: Material = {
      context: __dirname,
      referencePath: './unknown',
    };
    const resolver = new RelativeResolver({
      fs,
      mainFiles: [],
      extensions: [],
    });

    // default empty error
    expect(resolver.resolve(m)).rejects.toBeInstanceOf(Error);
  });
});
