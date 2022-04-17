import { LuaHelp } from "@cassolette/luahelpparser";

export type LuaHelpDocumentModes = "events" | "functions" | "enums";

export default interface Converter {
  type: LuaHelpDocumentModes;
  convert: (luaHelpAst: LuaHelp) => string[];
}
