import {
  LuaHelpFunction,
  LuaHelpFunctionParameter,
  LuaHelpFunctionReturn,
} from "@cassolette/luahelpparser";
import { DocFunc, DocFuncParam, DocFuncType, TSNamespace } from "./doc-helpers";
import {
  anyExportable,
  booleanExportable,
  ExportableType,
  FunctionExportable,
  integerExportable,
  LiteralExportable,
  nullExportable,
  numberExportable,
  stringExportable,
  tableExportable,
} from "./exportTypes";
import { overrides } from "./luahelp-functions.overrides";

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
    public defaultValue?: ExportableType,
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
    defaultValue?: ExportableType,
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
      ast.default
        ? ast.default === "nil"
          ? nullExportable
          : new LiteralExportable(ast.default)
        : null,
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

export { overrides as functionsOverrides };
