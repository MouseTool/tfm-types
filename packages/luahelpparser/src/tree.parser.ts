import { LuaHelpEvent, LuaHelpEventParameter } from "./events.interfaces";
import { LuaHelpTreeNode } from "./tree.interfaces";

class LuaHelpTreeNodeExporter {
  public children: LuaHelpTreeNodeExporter[];
  public parent?: LuaHelpTreeNodeExporter;

  constructor(public name: string, public value?: string) {
    this.children = [];
  }

  addChild(child: LuaHelpTreeNodeExporter) {
    child.parent = this;
    this.children.push(child);
  }

  export() {
    let ex: LuaHelpTreeNode;

    if (this.children.length > 0) {
      ex = {
        type: "table",
        name: this.name,
        children: (() =>
          Array.from(this.children.values(), (p) => p.export()))(),
      };
    } else if (this.value) {
      ex = {
        type: "value",
        name: this.name,
        value: this.value,
      };
    } else {
      ex = {
        type: "function",
        name: this.name,
      };
    }

    return ex;
  }
}

// ty tocu

// Note: Won't match _G or anything with underscores
const TREE_DATA_REGEX = /^(\s*)([a-zA-Z0-9]+)(?:\s:\s(\d+))?$/m;
const TREE_INDENT = 2;

export default function treeParser(lines: string[]) {
  const rootNode = new LuaHelpTreeNodeExporter("_G");
  let lastNode = rootNode;
  let lastIndent = -1;

  for (const [i, line] of lines.entries()) {
    if (line.length === 0) continue;
    const m = TREE_DATA_REGEX.exec(line);
    if (!m) continue;

    const indent = (m[1]?.length ?? 0) / TREE_INDENT; // either m or e
    const name = m[2];
    const value = m[3];

    if (!Number.isInteger(indent)) {
      throw new Error(`Malformed:${i}: bad identation`);
    }

    const node = new LuaHelpTreeNodeExporter(name, value);

    if (indent > lastIndent) {
      if (indent - lastIndent > 1) {
        throw new Error(
          `Malformed:${i}: unexpected identation, larger than expected`
        );
      }

      lastNode.addChild(node);
      lastIndent++;
    } else if (indent == lastIndent) {
      lastNode.parent.addChild(node);
    } else {
      // Go back up to the node's sibling
      let sibling = lastNode;
      while (lastIndent > indent) {
        sibling = sibling.parent;
        lastIndent--;
      }

      sibling.parent.addChild(node);
    }
    lastNode = node;
  }

  return rootNode.export();
}
