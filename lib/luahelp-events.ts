import {
  LuaHelpEvent,
  LuaHelpEventParameter,
  LuaHelpFunctionReturn,
} from "@cassolette/luahelpparser";
import {
  IDocFunc,
  IDocFuncParam,
  IDocFuncType,
  luaHelpTypeToExportable,
} from "./common.util";
import { ExportableType } from "./export-types";
import { overrides } from "./luahelp-events.overrides";

/**
 * Describes a generic type which has a documented description.
 */
export class DocEventType implements IDocFuncType {
  constructor(
    public type: ExportableType,
    public description: string = "",
    public additionalDescription: string[] = []
  ) {}

  static fromAstReturn(ast: LuaHelpFunctionReturn) {
    const type = luaHelpTypeToExportable[ast.type];
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

/**
 * Describes a parameter which has a documented description.
 */
export class DocEventParam extends DocEventType implements IDocFuncParam {
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
    const type = luaHelpTypeToExportable[ast.type];
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

/**
 * Describes a doc function that can be altered.
 */
export class DocEvent implements IDocFunc {
  public params: Map<string, DocEventParam>;

  constructor(public name: string, public description: string[] = []) {
    this.params = new Map<string, DocEventParam>();
  }

  /**
   * Gets the event string identifier based on the function name.
   *
   * The identifier is derived by stripping away the preceding "event" string and then lower-casing the first character.
   * For example, the identifier of `eventTextAreaCallback` would be `textAreaCallback`.
   */
  get eventStringIdentifier() {
    const m = this.name.match(/^(?:event)?(\w)(\w*)$/i);
    if (m != null) {
      const [_, firstChar, remainingString] = m;
      return firstChar.toLowerCase() + remainingString;
    }
    return null;
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
