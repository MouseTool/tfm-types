# tfm-lua-types

[Lua Language Server](https://github.com/sumneko/lua-language-server) environment definition for Transformice.

### Install for your workspace

```sh
npm install --save-dev tfm-lua-types
```

Set your VSCode workspace settings to register our third party library.

```json
{
    "Lua.workspace.userThirdParty": [
        "./node_modules/@mousetool/tfm-lua-types"
    ]
}
```

If you are using `.luarc.json`, this would be:
```json
{
    "workspace": {
        "userThirdParty": [
            "./node_modules/@mousetool/tfm-vscode"
        ]
    }
}
```

Finally, you should be asked to load the Transformice environment after writing your code.

![image](https://user-images.githubusercontent.com/79615454/156942548-6d56c05e-058b-4f98-94ec-9d766728fe0f.png)

### Without NPM

You can choose to install this library using Git submodules or any inclusion methods of your choice instead. However, path to the `userThirdParty` has to be updated accordingly.

```sh
git submodule add https://github.com/MouseTool/tfm-vscode.git
```

```json
{
    "Lua.workspace.userThirdParty": [
        "./tfm-lua-types"
    ]
}
```
