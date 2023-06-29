import {
  LuaHelpFunction,
  LuaHelpFunctionParameter,
  LuaHelpFunctionReturn,
} from "@cassolette/luahelpparser";
import {
  IDocFunc,
  IDocFuncParam,
  IDocFuncType,
  luaHelpTypeToExportable,
} from "./common.util";
import {
  ExportableType,
  LiteralExportable,
  nullExportable,
} from "./export-types";
import { overrides } from "./luahelp-functions.overrides";

/**
 * Describes a generic type which has a documented description.
 */
export class DocFunctionType implements IDocFuncType {
  constructor(
    public type: ExportableType,
    public description: string = "",
    public defaultValue?: ExportableType,
    public additionalDescription: string[] = []
  ) {}

  static fromAstReturn(ast: LuaHelpFunctionReturn) {
    const type = luaHelpTypeToExportable[ast.type];
    if (!type) throw new Error("no known type " + ast.type);

    return new DocFunctionType(type, ast.description);
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

/**
 * Describes a parameter which has a documented description.
 */
export class DocFunctionParam extends DocFunctionType implements IDocFuncParam {
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
    const type = luaHelpTypeToExportable[ast.type];
    if (!type) throw new Error("no known type " + ast.type);

    return new DocFunctionParam(
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

/**
 * Describes a doc function that can be altered.
 */
export class DocFunction implements IDocFunc {
  public params: Map<string, DocFunctionParam>;

  constructor(
    public name: string,
    public description: string[] = [],
    public returnType?: DocFunctionType
  ) {
    this.params = new Map<string, DocFunctionParam>();
  }

  static fromAstArray(ast: LuaHelpFunction[]) {
    const ret = [] as DocFunction[];
    for (const astf of ast) {
      const lhf = new DocFunction(
        astf.name,
        Array.from(astf.description),
        astf.return ? DocFunctionType.fromAstReturn(astf.return) : null
      );
      for (const p of astf.parameters) {
        lhf.addParam(DocFunctionParam.fromAst(p));
      }
      ret.push(lhf);
    }
    return ret;
  }

  addParam(param: DocFunctionParam) {
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

  setReturnType(type: DocFunctionType) {
    this.returnType = type;
  }
}

export { overrides as functionsOverrides };
