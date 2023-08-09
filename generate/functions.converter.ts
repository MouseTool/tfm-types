import {
  DocFuncBuilder,
  DocFuncBuilderParam,
  DocFuncBuilderType,
  functionsOverrides,
  DocFunction,
  TSNamespaceBuilder,
} from "../lib";
import Converter from "./converter.interfaces";

export const luaFunctionsConverter = {
  type: "functions",
  convert: (luaHelpAst) => {
    const newLines: string[] = [];

    for (const func of DocFunction.fromAstArray(luaHelpAst.functions)) {
      // Apply overrides
      const o = functionsOverrides[func.name];
      if (o) {
        if (o.type == "add") {
          throw `Your override "${o.name}" is an existing LuaHelp function. Please remove it!`;
        }
        o.modify(func);
      }

      const luaPar: DocFuncBuilderParam[] = [];
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

      const luaRet = func.returnType
        ? {
            description: [func.returnType.description],
            type: func.returnType.type,
            isOptional: func.returnType.isOptional,
          }
        : undefined;

      const luaFncDeclaration = new DocFuncBuilder(
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
    const globalNs = TSNamespaceBuilder.createGlobal();

    for (const func of DocFunction.fromAstArray(luaHelpAst.functions)) {
      // Apply overrides
      const o = functionsOverrides[func.name];
      if (o) {
        if (o.type == "add") {
          throw `Your override "${o.name}" is an existing LuaHelp function. Please remove it!`;
        }
        o.modify(func);
      }

      const tsPar: DocFuncBuilderParam[] = [];
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

      const tsRet = func.returnType
        ? {
            description: [func.returnType.description],
            type: func.returnType.type,
            isOptional: func.returnType.isOptional,
          }
        : undefined;

      const indexes = func.name.split(".");
      const tsFncDeclaration = new DocFuncBuilder(
        indexes.pop(),
        func.description,
        tsPar,
        tsRet
      );

      // Navigate to the function's corresponding namespace
      let namespace = globalNs;
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
