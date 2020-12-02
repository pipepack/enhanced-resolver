// package
import { relative, resolve } from 'path';
import { promises } from 'fs';
// internal
import { ModuleResolver } from '../src/ModuleResolver';
import { FileSystem } from '../src/interface/fs';
import { Material } from '../src/interface/resolver';

describe('Module Resolver', () => {
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
    const resolver = new ModuleResolver({
      fs,
      indexes: [],
      paths: [],
      fields: [],
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
    const resolver1 = new ModuleResolver({
      fs,
      indexes: [],
      paths: [],
      fields: [],
      extensions: ['.ts', '.mjs', '.js'],
    });
    const resolver2 = new ModuleResolver({
      fs,
      indexes: [],
      paths: [],
      fields: [],
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
    const resolver1 = new ModuleResolver({
      fs,
      extensions: ['.ts'],
      paths: [],
      fields: [],
      indexes: ['index.wechat', 'index.alipay', 'index'],
    });

    const terminal1 = await resolver1.resolve(m);
    const readable1 = relative(__dirname, terminal1.absPath);

    expect(readable1).toEqual('__fixture__/directory/index.wechat.ts');

    const resolver2 = new ModuleResolver({
      fs,
      paths: [],
      fields: [],
      extensions: ['.ts'],
      indexes: ['index.alipay', 'index.wechat', 'index'],
    });

    const terminal2 = await resolver2.resolve(m);
    const readable2 = relative(__dirname, terminal2.absPath);

    expect(readable2).toEqual('__fixture__/directory/index.alipay.ts');
  });

  it('should support npm module', async () => {
    const m1: Material = {
      context: __dirname,
      referencePath: 'rxjs/operators',
    };
    const m2: Material = {
      context: __dirname,
      referencePath: 'rxjs',
    };
    const resolver1 = new ModuleResolver({
      fs,
      fields: ['main'],
      extensions: ['.js'],
      indexes: ['index'],
      paths: [resolve(__dirname, '../node_modules')],
    });
    const resolver2 = new ModuleResolver({
      fs,
      fields: ['main'],
      indexes: ['index'],
      extensions: ['.js'],
      paths: [resolve(__dirname, '../node_modules')],
    });

    const terminal1 = await resolver1.resolve(m1);
    const readable1 = relative(__dirname, terminal1.absPath);

    expect(readable1).toEqual('../node_modules/rxjs/operators/index.js');

    const terminal2 = await resolver2.resolve(m2);
    const readable2 = relative(__dirname, terminal2.absPath);

    expect(readable2).toEqual('../node_modules/rxjs/index.js');
  });

  it('should reject when no match', () => {
    const m: Material = {
      context: __dirname,
      referencePath: './unknown',
    };
    const resolver = new ModuleResolver({
      fs,
      paths: [],
      fields: [],
      indexes: [],
      extensions: [],
    });

    // default empty error
    expect(resolver.resolve(m)).rejects.toBeInstanceOf(Error);
  });
});
