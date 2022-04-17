# luahelpparser

Parser for LuaHelp, an API documentation for the Lua tree from [Transformice](https://transformice.fandom.com/wiki/Transformice_Wiki). Produces an abstract syntax tree (AST)-like object representing the LuaHelp output.

## Example usage

```ts
import { promises as fsp } from "fs";
import { parse } from "@cassolette/luahelpparser";

const luaHelpAst = parse(
    (await fsp.readFile("./luahelp.txt")).toString()
);

console.log(JSON.stringify(luaHelpAst, null, 2));
```
