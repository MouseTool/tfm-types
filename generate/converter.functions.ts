import {
  DocFunc,
  DocFuncParam,
  DocFuncType,
  functionsOverrides,
  LDocFunction,
  TSNamespace,
} from "../lib";
import Converter from "./converter.interfaces";

export const luaFunctionsConverter = {
  type: "functions",
  convert: (luaHelpAst) => {
    const newLines: string[] = [];

    for (const func of LDocFunction.fromAstArray(luaHelpAst.functions)) {
      // Apply overrides
      const o = functionsOverrides[func.name];
      if (o) {
        if (o.type == "add") {
          throw `Your override "${o.name}" is an existing LuaHelp function. Please remove it!`;
        }
        o.modify(func);
      }

      const luaPar: DocFuncParam[] = [];
      for (const par of func.params.values()) {
        luaPar.push({
          description: [
            `${par.description}${
              par.defaultValue
                ? ` (default \`${par.defaultValue.asLua()}\`)`
                : ""
            }`,
            ...par.additionalDescription,
          ],
          name: par.displayName,
          type: par.type,
          isOptional: par.isOptional,
        });
      }

      const luaRet: DocFuncType = func.returnType
        ? {
            description: [func.returnType.description],
            type: func.returnType.type,
            isOptional: func.returnType.isOptional,
          }
        : null;

      const luaFncDeclaration = new DocFunc(
        func.name,
        func.description,
        luaPar,
        luaRet
      );

      newLines.push(...luaFncDeclaration.exportLuaDocLines(), "");
    }

    return newLines;
  },
} as Converter;

export const tstlFunctionsConverter = {
  type: "functions",
  convert: (luaHelpAst) => {
    const newLines: string[] = ["/** @noSelfInFile */"];
    const globalNs = TSNamespace.createGlobal();

    for (const func of LDocFunction.fromAstArray(luaHelpAst.functions)) {
      // Apply overrides
      const o = functionsOverrides[func.name];
      if (o) {
        if (o.type == "add") {
          throw `Your override "${o.name}" is an existing LuaHelp function. Please remove it!`;
        }
        o.modify(func);
      }

      const tsPar: DocFuncParam[] = [];
      for (const par of func.params.values()) {
        tsPar.push({
          description: [
            `${par.description}${
              par.defaultValue
                ? ` (default \`${par.defaultValue.asTs()}\`)`
                : ""
            }`,
            ...par.additionalDescription,
          ],
          name: par.displayName,
          type: par.type,
          isOptional: par.isOptional,
        });
      }

      const tsRet: DocFuncType = func.returnType
        ? {
            description: [func.returnType.description],
            type: func.returnType.type,
            isOptional: func.returnType.isOptional,
          }
        : null;

      const indexes = func.name.split(".");
      const tsFncDeclaration = new DocFunc(
        indexes.pop(),
        func.description,
        tsPar,
        tsRet
      );

      let namespace: TSNamespace = globalNs;
      for (const index of indexes) {
        namespace = namespace.navigate(index, true);
      }

      namespace.pushContent(tsFncDeclaration.exportJsDocCommentLines());
      namespace.pushStatement([tsFncDeclaration.exportTsFuncDeclare()]);
    }

    newLines.push(...globalNs.exportTstl());
    newLines.push("");

    return newLines;
  },
} as Converter;
