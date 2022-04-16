import Converter from "./converter.interfaces";
import { LuaHelpTreeNode, LuaHelpTreeTableNode } from "./parser";

class LDocTableNode {
  public children: LDocTableNode[];
  public parent?: LDocTableNode;

  constructor(public name: string, public ast?: LuaHelpTreeTableNode) {
    this.children = [];
  }

  static fromAst(ast: LuaHelpTreeTableNode) {
    const tblNode = new LDocTableNode(ast.name, ast);
    for (const c of ast.children) {
      if (c.type !== "table") continue;
      tblNode.addChild(LDocTableNode.fromAst(c));
    }
    return tblNode;
  }

  addChild(childNode: LDocTableNode) {
    this.children.push(childNode);
    childNode.parent = this;
  }

  /**
   * Navigate to a child table node.
   */
  navigate(name: string) {
    return this.children.find((c) => c.name === name);
  }

  exportLua(prefix?: string) {
    if (prefix) {
      prefix += "." + this.name;
    } else {
      prefix = this.name;
    }

    const newLines: string[] = [`${prefix} = {}`];

    for (const c of this.children) {
      newLines.push(...c.exportLua(prefix));
    }

    if (this.ast) {
      for (const entry of this.ast.children) {
        if (entry.type !== "value") continue;
        newLines.push(`${prefix}.${entry.name} = ${entry.value}`);
      }
    }

    newLines.push("");

    return newLines;
  }

  private static isReservedTs(word: string) {
    return word === "enum";
  }

  exportTstl(depth = 0) {
    // Avoid reserved words
    const isReservedName = LDocTableNode.isReservedTs(this.name);
    const namespaceName = isReservedName ? "$" + this.name : this.name;

    const singleIndentStr = " ".repeat(2);
    let indentStr = singleIndentStr.repeat(depth);
    const newLines: string[] = [
      indentStr +
        `${depth === 0 ? "declare " : ""}namespace ${namespaceName} {`,
    ];
    indentStr = singleIndentStr.repeat(++depth);

    for (const c of this.children) {
      newLines.push(...c.exportTstl(depth));
    }

    if (this.ast) {
      for (const entry of this.ast.children) {
        if (entry.type !== "value") continue;
        newLines.push(indentStr + `const ${entry.name} = ${entry.value};`);
      }
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

export const luaEnumsConverter = {
  type: "enums",
  convert: (luaHelpAst) => {
    const globalNode = LDocTableNode.fromAst(luaHelpAst.tree);
    const enumNode = globalNode.navigate("tfm").navigate("enum");

    const toExportNode = new LDocTableNode("tfm");
    toExportNode.addChild(enumNode);

    return toExportNode.exportLua();
  },
} as Converter;

export const tstlEnumsConverter = {
  type: "enums",
  convert: (luaHelpAst) => {
    const globalNode = LDocTableNode.fromAst(luaHelpAst.tree);
    const enumNode = globalNode.navigate("tfm").navigate("enum");

    const toExportNode = new LDocTableNode("tfm");
    toExportNode.addChild(enumNode);

    return toExportNode.exportTstl();
  },
} as Converter;
