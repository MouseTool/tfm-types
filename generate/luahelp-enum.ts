import Converter from "./converter.interfaces";
import { LuaHelpTreeTableNode } from "./parser";
import { isReservedTsKeyword } from "./doc-helpers";

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

  exportTstl(depth = 0) {
    const newLines: string[] = [];

    const pushNamespaceOrEnum = (isEnum: boolean) => {
      // Avoid reserved words
      const isReservedName = !isEnum && isReservedTsKeyword(this.name);
      const namespaceName = isReservedName ? "$" + this.name : this.name;

      const singleIndentStr = " ".repeat(2);
      let indentStr = singleIndentStr.repeat(depth);

      if (isEnum) {
        const capsName = namespaceName.charAt(0).toUpperCase() + namespaceName.slice(1)
        newLines.push(indentStr + `const enum ${capsName}Type {`);
      } else {
        newLines.push(
          indentStr +
            `${depth === 0 ? "declare " : ""}namespace ${namespaceName} {`
        );
      }

      indentStr = singleIndentStr.repeat(++depth);

      for (const c of this.children) {
        newLines.push(...c.exportTstl(depth));
      }

      if (this.ast) {
        for (const entry of this.ast.children) {
          if (entry.type !== "value") continue;
          const def = isEnum
            ? `${entry.name} = ${entry.value},`
            : `const ${entry.name} = ${entry.value};`;
          newLines.push(indentStr + def);
        }
      }

      indentStr = singleIndentStr.repeat(--depth);

      newLines.push(indentStr + "}");
      newLines.push("");

      if (isReservedName) {
        newLines.push(
          indentStr + `export { ${namespaceName} as ${this.name} }`
        );
      }
    };

    pushNamespaceOrEnum(false); // Namespace
    if (this.ast?.children[0]?.type === "value") {
      // Export a const enum type to provide an option to compile enums into literals, or use them
      // as types.
      pushNamespaceOrEnum(true); // Enum
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
