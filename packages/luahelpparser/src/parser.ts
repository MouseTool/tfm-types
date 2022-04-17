import * as striptags from "striptags"; // CJS default type export
import eventsParser from "./events.parser";
import functionsParser from "./functions.parser";
import { LuaHelp } from "./luaHelp.interfaces";
import treeParser from "./tree.parser";

type LuaHelpDocumentModes = "luaTree" | "events" | "functions";

export function parse(luaHelpText: string, isAS3Text: boolean = false) {
  if (isAS3Text) {
    // Strip away AS3 text area tags, if given in the raw format
    luaHelpText = striptags(luaHelpText);
  }

  let currentMode: LuaHelpDocumentModes | null;
  let bufLines: Record<LuaHelpDocumentModes, string[]> = {
    luaTree: [],
    events: [],
    functions: [],
  };
  let titleToModeMap: Record<string, LuaHelpDocumentModes> = {
    "Lua tree": "luaTree",
    Events: "events", // unused, so no need to get this mode
    Functions: "functions",
  };

  for (const line of luaHelpText.split(/\r?\n/)) {
    if (titleToModeMap[line]) {
      if (currentMode != titleToModeMap[line]) {
        // Mode change
        currentMode = titleToModeMap[line];
        continue;
      }
    }

    if (currentMode) {
      bufLines[currentMode].push(line);
    }
  }

  return {
    tree: treeParser(bufLines["luaTree"]),
    events: eventsParser(bufLines["events"]),
    functions: functionsParser(bufLines["functions"]),
  } as LuaHelp;
}
