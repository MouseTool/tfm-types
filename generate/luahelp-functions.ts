import Converter from "./converter.interfaces";
import { overrides } from "./luahelp-functions.overrides";
import {
  LuaHelpFunctionParameter,
  LuaHelpFunctionReturn,
  LuaHelpFunction,
} from "./parser";
import { DocFunc, DocFuncParam, DocFuncType, TSNamespace } from "./doc-helpers";
import {
  anyExportable,
  booleanExportable,
  ExportableType,
  FunctionExportable,
  integerExportable,
  numberExportable,
  stringExportable,
  tableExportable,
} from "./exportTypes";

const LUAHELP_TO_EXPORTABLE: Record<string, ExportableType> = {
  String: stringExportable,
  Int: integerExportable,
  Number: numberExportable,
  Boolean: booleanExportable,
  Table: tableExportable,
  Function: new FunctionExportable(),
  Object: anyExportable,
};

export class LDocFunctionType {
  constructor(
    public type: ExportableType,
    public description: string = "",
    public defaultValue?: string,
    public additionalDescription: string[] = []
  ) {}

  static fromAstReturn(ast: LuaHelpFunctionReturn) {
    const type = LUAHELP_TO_EXPORTABLE[ast.type];
    if (!type) throw new Error("no known type " + ast.type);

    return new LDocFunctionType(type, ast.description);
  }

  get isOptional() {
    return this.defaultValue != null;
  }

  setDescription(description: string) {
    this.description = description;
  }

  addDescription(desc: string) {
    this.additionalDescription.push(desc);
  }

  setType(type: ExportableType) {
    this.type = type;
  }
}

export class LDocFunctionParam extends LDocFunctionType {
  /**
   * The overriden name to export instead of `name`
   */
  public overrideName?: string;

  constructor(
    public name: string,
    type: ExportableType,
    description?: string,
    defaultValue?: string,
    additionalDescription?: string[]
  ) {
    super(type, description, defaultValue, additionalDescription);
  }

  static fromAst(ast: LuaHelpFunctionParameter) {
    const type = LUAHELP_TO_EXPORTABLE[ast.type];
    if (!type) throw new Error("no known type " + ast.type);

    return new LDocFunctionParam(
      ast.name,
      type,
      ast.description,
      ast.default,
      Array.from(ast.additionalDescriptions)
    );
  }

  get displayName() {
    return this.overrideName || this.name;
  }

  setOverrideName(name: string) {
    this.overrideName = name;
  }
}

export class LDocFunction {
  public params: Map<string, LDocFunctionParam>;

  constructor(
    public name: string,
    public description: string[] = [],
    public returnType?: LDocFunctionType
  ) {
    this.params = new Map<string, LDocFunctionParam>();
  }

  static fromAstArray(ast: LuaHelpFunction[]) {
    const ret = [] as LDocFunction[];
    for (const astf of ast) {
      const lhf = new LDocFunction(
        astf.name,
        Array.from(astf.description),
        astf.return ? LDocFunctionType.fromAstReturn(astf.return) : null
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

  setReturnType(type: LDocFunctionType) {
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

      const luaPar: DocFuncParam[] = [];
      for (const par of func.params.values()) {
        luaPar.push({
          description: [
            `${par.description}${
              par.defaultValue ? ` (default \`${par.defaultValue}\`)` : ""
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
      const o = overrides[func.name];
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
              par.defaultValue ? ` (default \`${par.defaultValue}\`)` : ""
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

      namespace.pushContent(...tsFncDeclaration.exportTsDocLines());
    }

    newLines.push(...globalNs.exportTstl());
    newLines.push("");

    return newLines;
  },
} as Converter;
