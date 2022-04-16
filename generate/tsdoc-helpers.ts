export type TSDocFuncType = {
  type: string;
  description: string[];
  isOptional?: boolean;
};

export type TSDocFuncParam = TSDocFuncType & {
  name: string;
};

export class TSDocFunc {
  constructor(
    public name: string,
    public description: string[],
    public parameters: TSDocFuncParam[],
    public returnType?: TSDocFuncType
  ) {}

  exportLines() {
    const lines: string[] = ["/**"];

    // Build jsdoc lines
    {
      const jsDocLines: string[] = [];

      for (const d of this.description) {
        jsDocLines.push(d);
      }

      for (const p of this.parameters) {
        jsDocLines.push(`@param ${p.name} ${p.description[0]}`);
        for (let i = 1; i < p.description.length; i++) {
          jsDocLines.push(p.description[i])
        }
      }

      if (this.returnType) {
        jsDocLines.push(`@returns ${this.returnType.description}`);
      }

      jsDocLines.forEach((s) => {
        lines.push(" * " + s);
      });
    }
    lines.push(" */");

    // Build TS function declaration
    lines.push(
      `function ${this.name}(${this.parameters
        .map((p) => `${p.name}${p.isOptional ? "?" : ""}: ${p.type}`)
        .join(", ")}): ${
        this.returnType
          ? `${this.returnType.type}${this.returnType.isOptional ? "?" : ""}`
          : "void"
      }`
    );

    return lines;
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
      newLines.push(indentStr + line);
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
