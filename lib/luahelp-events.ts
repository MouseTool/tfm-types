import {
  LuaHelpEvent,
  LuaHelpEventParameter,
  LuaHelpFunctionReturn,
} from "@cassolette/luahelpparser";
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
import { overrides } from "./luahelp-events.overrides";

const LUAHELP_TO_EXPORTABLE: Record<string, ExportableType> = {
  String: stringExportable,
  Int: integerExportable,
  Number: numberExportable,
  Boolean: booleanExportable,
  Table: tableExportable,
  Function: new FunctionExportable(),
  Object: anyExportable,
};

export class DocEventType {
  constructor(
    public type: ExportableType,
    public description: string = "",
    public additionalDescription: string[] = []
  ) {}

  static fromAstReturn(ast: LuaHelpFunctionReturn) {
    const type = LUAHELP_TO_EXPORTABLE[ast.type];
    if (!type) throw new Error("no known type " + ast.type);

    return new DocEventType(type, ast.description);
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

export class DocEventParam extends DocEventType {
  /**
   * The overriden name to export instead of `name`
   */
  public overrideName?: string;

  constructor(
    public name: string,
    type: ExportableType,
    description?: string,
    additionalDescription?: string[]
  ) {
    super(type, description, additionalDescription);
  }

  static fromAst(ast: LuaHelpEventParameter) {
    const type = LUAHELP_TO_EXPORTABLE[ast.type];
    if (!type) throw new Error("no known type " + ast.type);

    return new DocEventParam(
      ast.name,
      type,
      ast.description,
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

export class DocEvent {
  public params: Map<string, DocEventParam>;

  constructor(public name: string, public description: string[] = []) {
    this.params = new Map<string, DocEventParam>();
  }

  static fromAstArray(ast: LuaHelpEvent[]) {
    const ret = [] as DocEvent[];
    for (const astf of ast) {
      const lhf = new DocEvent(astf.name, Array.from(astf.description));
      for (const p of astf.parameters) {
        lhf.addParam(DocEventParam.fromAst(p));
      }
      ret.push(lhf);
    }
    return ret;
  }

  addParam(param: DocEventParam) {
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
}

export { overrides as eventsOverrides };
