import {
  DocEvent,
  DocFuncBuilder,
  DocFuncBuilderParam,
  TSNamespaceBuilder,
  eventsOverrides,
} from "../lib";
import Converter from "./converter.interfaces";

export const tstlEventsConverter = {
  type: "events",
  convert: (luaHelpAst) => {
    // _G events signature declaration
    // declare var eventTextAreaCallback: (this: void) => void;
    const declareEvtLines: string[] = [];

    // Declare type interface `tfm.EventIdentifier` for possible use in event emitters
    // interface EventIdentifier {
    //   textAreaCallback: (this: void) => void;
    // }
    const globalNs = TSNamespaceBuilder.createGlobal();
    const eventIntfLines: string[] = ["interface MappedEventIdentifier {"];

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

      declareEvtLines.push(...tsFncDeclaration.exportJsDocCommentLines());
      declareEvtLines.push(
        `declare var ${evtFn.name}: ${tsFncDeclaration.exportTsFuncType()};`
      );
      declareEvtLines.push("");

      eventIntfLines.push(`  ${evtFn.eventStringIdentifier}:`);
      eventIntfLines.push(
        ...tsFncDeclaration.exportJsDocCommentLines().map((val) => `    ` + val)
      );
      eventIntfLines.push(`    ${tsFncDeclaration.exportTsFuncType()};`);
    }

    eventIntfLines.push("}");
    globalNs.navigate("tfm").pushStatement(eventIntfLines);

    return [...declareEvtLines, ...globalNs.exportTstl(), ""];
  },
} as Converter;
