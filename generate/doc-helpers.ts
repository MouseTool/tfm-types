import { ExportableType } from "./exportTypes";

// Helpers to generate Lua or TypeScript definition from objects

export type DocFuncType = {
  type: ExportableType;
  description?: string[];
  isOptional?: boolean;
};

export type DocFuncParam = DocFuncType & {
  name: string;
};

export class DocFunc {
  constructor(
    public name?: string,
    public description: string[] = [],
    public parameters: DocFuncParam[] = [],
    public returnType?: DocFuncType
  ) {
    this.name = name;
    this.description = description;
  }

  /**
   * Exports the function declaration for TypeScript.
   *
   * Requires `name` supplied.
   */
  exportTsDocLines() {
    if (!this.name) {
      throw new Error('"name" must be supplied to call exportTsDocLines()');
    }

    const lines: string[] = [];

    // Build jsdoc lines
    {
      const jsDocLines: string[] = [];

      for (const d of this.description) {
        jsDocLines.push(d);
      }

      for (const p of this.parameters) {
        if (!p.description) continue;
        jsDocLines.push(`@param ${p.name} ${p.description[0]}`);
        for (let i = 1; i < p.description.length; i++) {
          jsDocLines.push(p.description[i]);
        }
      }

      if (this.returnType?.description) {
        jsDocLines.push(`@returns ${this.returnType.description}`);
      }

      if (jsDocLines.length > 0) {
        lines.push("/**");
        for (const s of jsDocLines) {
          lines.push(` * ${s}`.trimEnd());
        }
        lines.push(" */");
      }
    }

    // Build TS function declaration
    lines.push(
      `function ${this.name}(${this.parameters
        .map((p) => `${p.name}${p.isOptional ? "?" : ""}: ${p.type.asTs()}`)
        .join(", ")}): ${
        this.returnType
          ? `${this.returnType.type.asTs()}${
              this.returnType.isOptional ? " | undefined" : ""
            }`
          : "void"
      }`
    );

    return lines;
  }

  /**
   * Exports the function in literal TSTL arrow function type.
   *
   * No function names and descriptions are exported.
   */
  exportTsFuncType() {
    // Build TSTL function declaration
    // It is likely we mean to exclude the self parameter, are there any cases we don't though?
    return `(this: void, ${this.parameters
      .map((p) => `${p.name}${p.isOptional ? "?" : ""}: ${p.type.asTs()}`)
      .join(", ")}) => ${
      this.returnType
        ? `${this.returnType.type.asTs()}${
            this.returnType.isOptional ? " | undefined" : ""
          }`
        : "void"
    }`;
  }

  /**
   * Exports the function declaration for Lua.
   *
   * Requires `name` supplied.
   */
  exportLuaDocLines() {
    if (!this.name) {
      throw new Error('"name" must be supplied to call exportTsDocLines()');
    }

    const lines: string[] = [];

    // Build luadoc lines
    {
      const luaDocLines: string[] = [];

      for (const d of this.description) {
        luaDocLines.push(d);
      }

      for (const p of this.parameters) {
        if (!p.description) continue;
        luaDocLines.push(
          `@param ${p.name}${p.isOptional ? "?" : ""} ${p.type.asLua()} ${
            p.description[0]
          }`
        );
        for (let i = 1; i < p.description.length; i++) {
          luaDocLines.push(p.description[i]);
        }
      }

      if (this.returnType) {
        luaDocLines.push(
          `@return ${this.returnType.type.asLua()}${
            this.returnType.isOptional ? "?" : ""
          } # ${this.returnType.description}`
        );
      }

      if (luaDocLines.length > 0) {
        for (const s of luaDocLines) {
          lines.push(`--- ${s}`.trimEnd());
        }
      }
    }

    // Build Lua function declaration
    lines.push(
      `function ${this.name}(${this.parameters
        .map((p) => p.name)
        .join(", ")}) end`
    );

    return lines;
  }

  /**
   * Exports the function in Lua literal `fun()` type.
   *
   * No function names and descriptions are exported.
   */
  exportLuaFuncType() {
    // Build TS function declaration
    return `fun(${this.parameters
      .map((p) => `${p.name}${p.isOptional ? "?" : ""}: ${p.type.asLua()}`)
      .join(", ")})${
      this.returnType
        ? `: ${this.returnType.type.asLua()}${
            this.returnType.isOptional ? "?" : ""
          }`
        : ""
    }`;
  }
}

// TODO
export function isReservedTsKeyword(word: string) {
  return word === "enum";
}

export class TSNamespace {
  children: Map<string, TSNamespace>;
  content: string[];

  private constructor(public name?: string, public parent?: TSNamespace) {
    this.children = new Map<string, TSNamespace>();
    this.content = [];
  }

  static createGlobal() {
    return new TSNamespace("globalThis");
  }

  get isGlobal() {
    return this.parent == null;
  }

  /**
   * Navigates to a child
   */
  navigate(name: string, createIfNone: boolean = true): TSNamespace {
    let child = this.children.get(name);
    if (createIfNone && !child) {
      child = new TSNamespace(name, this);
      this.children.set(name, child);
    }
    return child;
  }

  pushContent(...content: string[]) {
    this.content.push("", ...content);
  }

  exportTstl(depth = 0) {
    if (this.isGlobal) {
      const newLines: string[] = [];
      for (const c of this.children.values()) {
        newLines.push(...c.exportTstl(depth));
      }
      return newLines;
    }

    // Avoid reserved words
    const isReservedName = isReservedTsKeyword(this.name);
    const namespaceName = isReservedName ? "$" + this.name : this.name;

    const singleIndentStr = " ".repeat(2);
    let indentStr = singleIndentStr.repeat(depth);

    const newLines: string[] = [];

    newLines.push(
      indentStr +
        `${this.parent.isGlobal ? "declare " : ""}namespace ${namespaceName} {`
    );

    indentStr = singleIndentStr.repeat(++depth);

    for (const c of this.children.values()) {
      newLines.push(...c.exportTstl(depth));
    }

    for (const line of this.content) {
      newLines.push(line.length > 0 ? indentStr + line : "");
    }

    indentStr = singleIndentStr.repeat(--depth);

    newLines.push(indentStr + "}");
    newLines.push("");

    if (isReservedName) {
      newLines.push(indentStr + `export { ${namespaceName} as ${this.name} }`);
    }

    return newLines;
  }
}
