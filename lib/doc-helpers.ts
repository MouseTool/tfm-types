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

/**
 * Helper class to create function declarations.
 */
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
   * Exports the comment portion of the JSDoc.
   */
  exportJsDocCommentLines() {
    const lines: string[] = [];

    {
      // Build jsdoc lines
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

    return lines;
  }
  /**
   * Exports the function declaration (without the JSDoc comments).
   *
   * Requires `name` supplied.
   */
  exportTsFuncDeclare() {
    if (!this.name) {
      throw new Error('"name" must be supplied to call exportTsDocLines()');
    }

    // Build TS function declaration
    return `function ${this.name}(${this.parameters
      .map((p) => `${p.name}${p.isOptional ? "?" : ""}: ${p.type.asTs()}`)
      .join(", ")}): ${
      this.returnType
        ? `${this.returnType.type.asTs()}${
            this.returnType.isOptional ? " | undefined" : ""
          }`
        : "void"
    }`;
  }

  /**
   * Exports the function in literal TSTL arrow function type.
   *
   * No function names and descriptions are exported.
   */
  exportTsFuncType() {
    // Build TSTL function declaration
    // It is likely we mean to exclude the self parameter... are there any cases we don't though? :thinking:
    const paramsDef = [
      "this: void",
      ...this.parameters.map(
        (p) => `${p.name}${p.isOptional ? "?" : ""}: ${p.type.asTs()}`
      ),
    ].join(", ");

    return `(${paramsDef}) => ${
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
function isReservedTsKeyword(word: string) {
  return word === "enum";
}

/**
 * Helper class to create TypeScript namespaces.
 */
export class TSNamespace {
  children: Map<string, TSNamespace>;
  contents: { type: "statement" | "content"; value: string[] }[];
  singleIndentString: string;

  constructor(public name?: string, public parent?: TSNamespace) {
    this.children = new Map<string, TSNamespace>();
    this.contents = [];
    this.singleIndentString = "  ";
  }

  static createGlobal() {
    return new TSNamespace("globalThis");
  }

  get isRoot() {
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

  pushContent(content: string[]) {
    this.contents.push({ type: "content", value: content });
  }

  pushStatement(statement: string[]) {
    if (statement.length === 0) {
      throw new Error("Tried to push empty statement?");
    }
    this.contents.push({ type: "statement", value: statement });
  }

  /**
   * If the namespace's name is a reserved keyword, this function returns its internal
   */
  internalName() {}

  /**
   * Exports the namespace content.
   */
  exportTstl(depth = 0) {
    const indentStr = this.singleIndentString.repeat(depth);

    const newLines: string[] = [];

    for (const c of this.children.values()) {
      // Avoid reserved words
      const isReservedName = isReservedTsKeyword(c.name);
      const namespaceName = isReservedName ? "$" + c.name : c.name;

      newLines.push(
        indentStr +
          `${
            this.isRoot ? "declare " : isReservedName ? "" : "export "
          }namespace ${namespaceName} {`
      );
      newLines.push(...c.exportTstl(depth + 1));
      newLines.push(indentStr + "}");

      if (isReservedName) {
        newLines.push(indentStr + `export { ${namespaceName} as ${c.name} }`);
      }
    }

    for (const contentMeta of this.contents) {
      if (contentMeta.type === "statement") {
        newLines.push(
          indentStr + `${this.isRoot ? "declare" : "export"} ${contentMeta.value[0]}`
        );
        for (let i = 1; i < contentMeta.value.length; i++) {
          newLines.push(indentStr + contentMeta.value[i]);
        }
      } else {
        for (const content of contentMeta.value) {
          newLines.push(indentStr + content);
        }
      }
    }

    return newLines;
  }
}
