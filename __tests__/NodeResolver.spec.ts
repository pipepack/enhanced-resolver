// package
import { join, relative } from 'path';
import { promises } from 'fs';
// internal
import { NodeResolver } from '../src/NodeResolver';
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
    const resolver = new NodeResolver({
      fs,
      modules: [],
      mainFiles: [],
      mainFields: [],
      descriptionFiles: [],
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
    const resolver1 = new NodeResolver({
      fs,
      modules: [],
      mainFiles: [],
      mainFields: [],
      descriptionFiles: [],
      extensions: ['.ts', '.mjs', '.js'],
    });
    const resolver2 = new NodeResolver({
      fs,
      modules: [],
      mainFiles: [],
      mainFields: [],
      descriptionFiles: [],
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
    const resolver1 = new NodeResolver({
      fs,
      modules: [],
      mainFields: [],
      descriptionFiles: [],
      extensions: ['.ts'],
      mainFiles: ['index.wechat', 'index.alipay', 'index'],
    });

    const terminal1 = await resolver1.resolve(m);
    const readable1 = relative(__dirname, terminal1.absPath);

    expect(readable1).toEqual('__fixture__/directory/index.wechat.ts');

    const resolver2 = new NodeResolver({
      fs,
      modules: [],
      mainFields: [],
      descriptionFiles: [],
      extensions: ['.ts'],
      mainFiles: ['index.alipay', 'index.wechat', 'index'],
    });

    const terminal2 = await resolver2.resolve(m);
    const readable2 = relative(__dirname, terminal2.absPath);

    expect(readable2).toEqual('__fixture__/directory/index.alipay.ts');
  });

  it('should support npm installed module by index', async () => {
    const m: Material = {
      context: __dirname,
      referencePath: 'rxjs/operators',
    };
    const resolver = new NodeResolver({
      fs,
      modules: [join(__dirname, '../node_modules')],
      mainFiles: ['index'],
      mainFields: [],
      descriptionFiles: [],
      extensions: ['.js'],
    });
    const terminal = await resolver.resolve(m);
    const readable = relative(__dirname, terminal.absPath);

    expect(readable).toEqual('../node_modules/rxjs/operators/index.js');
  });

  it('should support npm installed module by package.json', async () => {
    const m: Material = {
      context: __dirname,
      referencePath: 'rxjs',
    };
    const resolver1 = new NodeResolver({
      fs,
      modules: [join(__dirname, '../node_modules')],
      mainFiles: [],
      mainFields: ['main'],
      descriptionFiles: ['package.json'],
      extensions: ['.js'],
    });
    const resolver2 = new NodeResolver({
      fs,
      modules: [join(__dirname, '../node_modules')],
      mainFiles: [],
      mainFields: ['module', 'main'],
      descriptionFiles: ['package.json'],
      extensions: ['.js'],
    });
    const terminal1 = await resolver1.resolve(m);
    const readable1 = relative(__dirname, terminal1.absPath);

    expect(readable1).toEqual('../node_modules/rxjs/index.js');

    const terminal2 = await resolver2.resolve(m);
    const readable2 = relative(__dirname, terminal2.absPath);

    expect(readable2).toEqual('../node_modules/rxjs/_esm5/index.js');
  });

  it('should support npm installed module by package.json', async () => {
    const m: Material = {
      context: __dirname,
      referencePath: 'preact/hooks',
    };
    const resolver1 = new NodeResolver({
      fs,
      modules: [join(__dirname, '../node_modules')],
      mainFiles: [],
      mainFields: ['main'],
      descriptionFiles: ['package.json'],
      extensions: ['.js'],
    });

    const terminal1 = await resolver1.resolve(m);
    const readable1 = relative(__dirname, terminal1.absPath);

    expect(readable1).toEqual('../node_modules/preact/hooks/dist/hooks.js');
  });

  it('should reject when no match', () => {
    const m: Material = {
      context: __dirname,
      referencePath: './unknown',
    };
    const resolver = new NodeResolver({
      fs,
      modules: [],
      mainFiles: [],
      mainFields: [],
      descriptionFiles: [],
      extensions: [],
    });

    // default empty error
    expect(resolver.resolve(m)).rejects.toBeInstanceOf(Error);
  });
});
