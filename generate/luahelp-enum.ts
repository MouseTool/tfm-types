import { LuaHelpTreeTableNode } from "@cassolette/luahelpparser";
import Converter from "./converter.interfaces";
import { isReservedTsKeyword, TSNamespace } from "./doc-helpers";

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

  /**
   * Recursively writes content to enum namespaces.
   * @param enumNs `tfm.enum.X.X`
   * @param enumTypeNs `tfm.Enums.X`
   */
  writeTstlNamespace(enumNs: TSNamespace, enumTypeNs: TSNamespace) {
    const isEnum = this.ast?.children[0]?.type === "value";

    for (const c of this.children) {
      c.writeTstlNamespace(enumNs.navigate(c.name), enumTypeNs);
    }

    if (!isEnum) {
      // Nothing else to do.
      return;
    }

    const enumNsContent: string[] = [];
    const enumTypeNsContent: string[] = [];

    for (const entry of this.ast.children) {
      if (entry.type !== "value") continue;
      // const def = isEnum
      //   ? `${entry.name} = ${entry.value},`
      //   : `const ${entry.name} = ${entry.value};`;
      // newLines.push(indentStr + def);
      enumNsContent.push(`const ${entry.name} = ${entry.value};`);
      enumTypeNsContent.push(`    ${entry.name} = ${entry.value},`);
    }

    enumNs.pushStatement([...enumNsContent]);
    // Create new enum in the Enums namespace.
    // Export a const enum type to provide an option to compile enums into literals, or use them
    // as types.
    const capsName = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    enumTypeNs.pushStatement([
      `const enum ${capsName}Type {`,
      ...enumTypeNsContent,
      "}",
    ]);
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

    const globalNs = TSNamespace.createGlobal();
    const enumNs = globalNs.navigate("tfm").navigate(enumNode.name);
    const enumTypeNs = globalNs.navigate("tfm").navigate("Enums");

    // Populate namespaces
    enumNode.writeTstlNamespace(enumNs, enumTypeNs);

    const newLines: string[] = [];
    newLines.push(...globalNs.exportTstl());
    newLines.push("");

    return newLines;
  },
} as Converter;
