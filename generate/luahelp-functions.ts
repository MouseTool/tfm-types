import Converter from "./converter.interfaces";
import { overrides } from "./luahelp-functions.overrides";
import {
  LuaHelpFunctionParameter,
  LuaHelpFunctionReturn,
  LuaHelpFunction,
} from "./parser";
import {
  TSDocFunc,
  TSDocFuncParam,
  TSDocFuncType,
  TSNamespace,
} from "./tsdoc-helpers";

// LDoc here = sumneko.lua LuaDoc ...
const LUAHELP_TO_LDOC_TYPE: Record<string, string> = {
  String: "string",
  Int: "integer",
  Number: "number",
  Boolean: "boolean",
  Table: "table",
  Function: "function",
  Object: "any",
};

// TODO: Compile into objects......
const LDOC_TO_TS_TYPE: Record<string, string> = {
  integer: "tfm.integer",
  table: "object",
  function: "Function",
};

export class LDocFunctionParam {
  /**
   * The overriden name to export instead of `name`
   */
  public overrideName?: string;

  constructor(
    public name: string,
    public type: string,
    public description: string = "",
    public defaultValue?: string,
    public additionalDescription: string[] = []
  ) {}

  static fromAst(ast: LuaHelpFunctionParameter) {
    const type = LUAHELP_TO_LDOC_TYPE[ast.type];
    if (!type) throw new Error("no known type " + ast.type);

    return new LDocFunctionParam(
      ast.name,
      type,
      ast.description,
      ast.default,
      Array.from(ast.additionalDescriptions)
    );
  }

  static fromAstReturn(ast: LuaHelpFunctionReturn) {
    const type = LUAHELP_TO_LDOC_TYPE[ast.type];
    if (!type) throw new Error("no known type " + ast.type);

    return new LDocFunctionParam("Returns", type, ast.description);
  }

  get isOptional() {
    return this.defaultValue != null;
  }

  get displayName() {
    return this.overrideName || this.name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  addDescription(desc: string) {
    this.additionalDescription.push(desc);
  }

  setOverrideName(name: string) {
    this.overrideName = name;
  }

  setType(type: string) {
    this.type = type;
  }
}

export class LDocFunction {
  public params: Map<string, LDocFunctionParam>;

  constructor(
    public name: string,
    public description: string[] = [],
    public returnType?: LDocFunctionParam
  ) {
    this.params = new Map<string, LDocFunctionParam>();
  }

  static fromAstArray(ast: LuaHelpFunction[]) {
    const ret = [] as LDocFunction[];
    for (const astf of ast) {
      const lhf = new LDocFunction(
        astf.name,
        Array.from(astf.description),
        astf.return ? LDocFunctionParam.fromAstReturn(astf.return) : null
      );
      for (const p of astf.parameters) {
        lhf.addParam(LDocFunctionParam.fromAst(p));
      }
      ret.push(lhf);
    }
    return ret;
  }

  addParam(param: LDocFunctionParam) {
    this.params.set(param.name, param);
    return this;
  }

  setDescription(description: string | string[]) {
    this.description =
      typeof description === "string" ? [description] : description;
  }

  pushDescription(description: string) {
    this.description.push("");
    this.description.push(description);
    return this;
  }

  setReturnType(type: LDocFunctionParam) {
    this.returnType = type;
  }
}

export const luaFunctionsConverter = {
  type: "functions",
  convert: (luaHelpAst) => {
    const newLines: string[] = [];

    for (const func of LDocFunction.fromAstArray(luaHelpAst.functions)) {
      // Apply overrides
      const o = overrides[func.name];
      if (o) {
        if (o.type == "add") {
          throw `Your override "${o.name}" is an existing LuaHelp function. Please remove it!`;
        }
        o.modify(func);
      }

      const parNames = [];
      for (const desc of func.description) {
        newLines.push(`---${desc ? ` ${desc}` : ""}`);
      }

      for (const par of func.params.values()) {
        newLines.push(
          `--- @param ${par.displayName}${par.isOptional ? "?" : ""} ${
            par.type
          } ${par.description}${
            par.defaultValue ? ` (default \`${par.defaultValue}\`)` : ""
          }`
        );
        for (const desc of par.additionalDescription) {
          newLines.push(`--- ${desc}`);
        }
        parNames.push(par.displayName);
      }
      if (func.returnType) {
        newLines.push(
          `--- @return ${func.returnType.type}${
            func.returnType.isOptional ? "?" : ""
          } @${func.returnType.description}`
        );
      }
      newLines.push(`function ${func.name}(${parNames.join(", ")}) end`);
      newLines.push("");
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
      const o = overrides[func.name];
      if (o) {
        if (o.type == "add") {
          throw `Your override "${o.name}" is an existing LuaHelp function. Please remove it!`;
        }
        o.modify(func);
      }

      const tsPar: TSDocFuncParam[] = [];
      for (const par of func.params.values()) {
        const type = LDOC_TO_TS_TYPE[par.type] ?? par.type;
        tsPar.push({
          description: [
            `${par.description}${
              par.defaultValue ? ` (default \`${par.defaultValue}\`)` : ""
            }`,
            ...par.additionalDescription,
          ],
          name: par.displayName,
          type,
          isOptional: par.isOptional,
        });
      }

      const tsRet: TSDocFuncType = func.returnType
        ? {
            description: [func.returnType.description],
            type: LDOC_TO_TS_TYPE[func.returnType.type] ?? func.returnType.type,
            isOptional: func.returnType.isOptional,
          }
        : null;

      const indexes = func.name.split(".");
      const tsFncDeclaration = new TSDocFunc(
        indexes.pop(),
        func.description,
        tsPar,
        tsRet
      );

      let namespace: TSNamespace = globalNs;
      for (const index of indexes) {
        namespace = namespace.navigate(index, true);
      }

      namespace.pushContent(...tsFncDeclaration.exportLines());
    }

    newLines.push(...globalNs.exportTstl());
    newLines.push("");

    return newLines;
  },
} as Converter;
