import Converter from "./converter.interfaces";
import { TSNamespace } from "../lib/doc-helpers";
import { LDocTableNode } from "../lib";

export const luaEnumsConverter = {
  type: "enums",
  convert: (luaHelpAst) => {
    const globalNode = LDocTableNode.fromAst(luaHelpAst.tree);
    const enumNode = globalNode.navigate("tfm").navigate("enum");

    // Write "tfm." prefix passively, don't export `tfm = {}`\
    const newLines = enumNode.exportLua("tfm");
    newLines.push("");
    return newLines;
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
