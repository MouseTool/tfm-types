import Converter from "./converter.interfaces";
import { TSNamespaceBuilder } from "../lib/doc-builders";
import { DocTableNode } from "../lib";

export const luaEnumsConverter = {
  type: "enums",
  convert: (luaHelpAst) => {
    const globalNode = DocTableNode.fromAst(luaHelpAst.tree);
    const enumNode = globalNode.navigate("tfm")!.navigate("enum")!;

    // Write "tfm." prefix passively, don't export `tfm = {}`\
    const newLines = enumNode.exportLua("tfm");
    newLines.push("");
    return newLines;
  },
} as Converter;

export const tstlEnumsConverter = {
  type: "enums",
  convert: (luaHelpAst) => {
    const globalNode = DocTableNode.fromAst(luaHelpAst.tree);
    const enumNode = globalNode.navigate("tfm")!.navigate("enum")!;

    const globalNs = TSNamespaceBuilder.createGlobal();
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
