import { LuaHelpEvent } from "./events.interfaces";
import { LuaHelpFunction } from "./functions.interfaces"
import { LuaHelpTreeTableNode } from "./tree.interfaces"

export interface LuaHelp {
    tree: LuaHelpTreeTableNode;
    events: LuaHelpEvent[];
    functions: LuaHelpFunction[];
    version: string;
}
