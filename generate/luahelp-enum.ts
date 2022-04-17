import Converter from "./converter.interfaces";
import { LuaHelpTreeNode, LuaHelpTreeTableNode } from "./parser";

class LDocTableNode {
  public children: LDocTableNode[];
  public parent?: LDocTableNode;

  constructor(public name: string, public ast: LuaHelpTreeTableNode) {
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

  export(prefix?: string) {
    if (prefix) {
      prefix += "." + this.name;
    } else {
      prefix = this.name;
    }

    const newLines: string[] = [`${prefix} = {}`];

    for (const c of this.children) {
      newLines.push(...c.export(prefix));
    }

    for (const entry of this.ast.children) {
      if (entry.type !== "value") continue;
      newLines.push(`${prefix}.${entry.name} = ${entry.value}`);
    }
    newLines.push("");

    return newLines;
  }
}

const enumsConverter = {
  type: "enums",
  convert: (luaHelpAst) => {
    const globalNode = LDocTableNode.fromAst(luaHelpAst.tree);
    const enumNode = globalNode.navigate("tfm").navigate("enum");

    return enumNode.export("tfm");
  },
} as Converter;
export default enumsConverter;
