export type LuaHelpTreeNodeType = "table" | "function" | "value";

export type LuaHelpTreeNode =
  | {
      type: "table";
      name: string;
      children: LuaHelpTreeNode[];
    }
  | {
      type: "function";
      name: string;
    }
  | {
      type: "value";
      name: string;
      value: string;
    };

export type LuaHelpTreeTableNode = { type: "table" } & LuaHelpTreeNode;
