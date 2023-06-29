import { LuaHelpTreeTableNode } from "@cassolette/luahelpparser";
import { TSNamespaceBuilder } from "./doc-builders";

export class DocTableNode {
  public children: DocTableNode[];
  public parent?: DocTableNode;

  constructor(public name: string, public ast?: LuaHelpTreeTableNode) {
    this.children = [];
  }

  static fromAst(ast: LuaHelpTreeTableNode) {
    const tblNode = new DocTableNode(ast.name, ast);
    for (const c of ast.children) {
      if (c.type !== "table") continue;
      tblNode.addChild(DocTableNode.fromAst(c));
    }
    return tblNode;
  }

  addChild(childNode: DocTableNode) {
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
      newLines.push("", ...c.exportLua(prefix));
    }

    if (this.ast) {
      for (const entry of this.ast.children) {
        if (entry.type !== "value") continue;
        newLines.push(`${prefix}.${entry.name} = ${entry.value}`);
      }
    }

    return newLines;
  }

  /**
   * Recursively writes content to enum namespaces.
   * @param enumNs `tfm.enum.X.X`
   * @param enumTypeNs `tfm.Enums.X`
   */
  writeTstlNamespace(enumNs: TSNamespaceBuilder, enumTypeNs: TSNamespaceBuilder) {
    const isEnum = this.ast?.children[0]?.type === "value";

    for (const c of this.children) {
      c.writeTstlNamespace(enumNs.navigate(c.name), enumTypeNs);
    }

    if (!isEnum) {
      // Nothing else to do.
      return;
    }

    const enumTypeNsContent: string[] = [];

    for (const entry of this.ast.children) {
      if (entry.type !== "value") continue;
      enumNs.pushStatement([`const ${entry.name} = ${entry.value};`]);
      enumTypeNsContent.push(`    ${entry.name} = ${entry.value},`);
    }

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
