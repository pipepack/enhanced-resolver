# enhanced-resolver

![Build Status](https://img.shields.io/travis/pipepack/enhanced-resolver/master.svg?style=flat)
[![Coverage Status](https://coveralls.io/repos/github/pipepack/enhanced-resolver/badge.svg?branch=master)](https://coveralls.io/github/pipepack/?branch=master)
![Package Dependency](https://david-dm.org/pipepack/enhanced-resolver.svg?style=flat)
![Package DevDependency](https://david-dm.org/pipepack/enhanced-resolver/dev-status.svg?style=flat)

yet, reimplement enhanced-resolve with the idea &#x27;simple is best&#x27;.


## Usage

```shell
# compile in watch mode
npm run compile:watch;

# unit test with coverage
npm run test;
```

## Attention

- tsc compiler compile without `polyfill`, mainly provide declare files
- babel compiler compile `commonjs` style code
- remember to change meta field in the `package.json`
- compile script automatically run before publish, no need for manual compile

# Licence

MIT
