import { LuaHelp } from "@cassolette/luahelpparser";

export type LuaHelpDocumentModes = "functions" | "enums";

export default interface Converter {
  type: LuaHelpDocumentModes;
  convert: (luaHelpAst: LuaHelp) => string[];
}
