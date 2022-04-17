# tfm-tstl-types

Provides the [TypeScriptToLua](https://github.com/TypeScriptToLua/) environment definition for Transformice.

## Install

1. Get this package from npm

```sh
npm install -D tfm-tstl-types
# or
yarn add -D tfm-tstl-types
```

2. Modify your tsconfig.json

```diff
{
  "compilerOptions": {
+    "types": ["tfm-tstl-types/types"]
  }
}
```

## Usage

Most of the usage and function calls remain largely similar to that of Lua.

### Defining events

```ts
eventLoop = (elapsedTime, remainingTime) => {
  // Intellisense will pick up the types.
  // You can hover over the `eventLoop` for additional context.
}
```

### Enums

Enums can be used the same way as in Lua. These are just normal namespaced consts.

```ts
const id = tfm.enum.bonus.electricArc
```

The type library also provides [const enums](https://www.typescriptlang.org/docs/handbook/enums.html#const-enums) for use as types or inlining at compile-time.

```ts
const id = tfm.enum.bonus.electricArc as tfm.enum.BonusType
// ^ id is of type tfm.enum.BonusType
```

Sometimes, you may find that you need to use IDs that don't exist within the const enums.

```ts
eventContactListener = (playerName, groundId, contactInfos) => {
  if (groundId == 42069) {
      // ^ error: "This condition will always return 'false' since the types 'GroundType' and
      //           '42069' have no overlap. ts(2367)"
  }
}
```

In this case, it is reasonable to just cast the variable back into its primitive type.

```ts
eventContactListener = (playerName, groundId: number /* cast at source */, contactInfos) => {
    // Or cast at assertion
    if (groundId as number == 42069) {
    }
}
```
