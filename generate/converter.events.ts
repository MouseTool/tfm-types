import { DocEvent, DocFuncBuilder, DocFuncBuilderParam, eventsOverrides } from "../lib";
import Converter from "./converter.interfaces";

export const tstlEventsConverter = {
  type: "events",
  convert: (luaHelpAst) => {
    const newLines: string[] = [];

    for (const evtFn of DocEvent.fromAstArray(luaHelpAst.events)) {
      // Apply overrides
      const o = eventsOverrides[evtFn.name];
      if (o) {
        o.modify(evtFn);
      }

      const tsPar: DocFuncBuilderParam[] = [];
      for (const par of evtFn.params.values()) {
        tsPar.push({
          description: [par.description, ...par.additionalDescription],
          name: par.displayName,
          type: par.type,
        });
      }

      const tsFncDeclaration = new DocFuncBuilder(
        undefined, // evtFn.name
        evtFn.description,
        tsPar
      );

      newLines.push(...tsFncDeclaration.exportJsDocCommentLines());
      newLines.push(
        `declare var ${evtFn.name}: ${tsFncDeclaration.exportTsFuncType()};`
      );
      newLines.push("");
    }

    return newLines;
  },
} as Converter;
