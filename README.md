# tfm-types

Environment definition generator for [Transformice](https://transformice.fandom.com/wiki/Transformice_Wiki). Supports [Lua Language Server](https://github.com/sumneko/lua-language-server) and [TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua).

## Usage

### Generating environment definition

```sh
pnpm install
pnpm run generate
```

### As a dependency to generate your own documentation

```sh
pnpm install -D @mousetool/tfm-types
# or
yarn add -D @mousetool/tfm-types
# or
npm install -D @mousetool/tfm-types
```

### Content

This repository includes a [generator script](./generate/), and exports a few supporting [utility libraries](./lib/). It is also home to the below packages:

| Package | Description | Remarks |
| ------- | ----------- | ------- |
| [`luahelpparser`](./packages/luahelpparser/) | Parser for LuaHelp, an API documentation for the Lua tree. Produces an abstract syntax tree (AST)-like object representing the LuaHelp output. | Available on the NPM registry as [`@cassolette/luahelpparser`](https://www.npmjs.com/package/@cassolette/luahelpparser). |
| [`lua-types`](./packages/lua-types/) | [Lua Language Server](https://github.com/sumneko/lua-language-server) environment definition for Transformice. | Automatically generated and kept updated by the [generator](./generate/). |
| [`tstl-types`](./packages/tstl-types/) | Provides the [TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua) environment definition for Transformice. | Automatically generated and kept updated by the [generator](./generate/). Available on the NPM registry as [`tfm-tstl-types`](https://www.npmjs.com/package/tfm-tstl-types). |
