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
    // Generates:
    //   declare var eventTextAreaCallback: (this: void) => void;
    const declareEvtLines: string[] = [];

    // Declare type interface `tfm.MappedEventIdentifier` for possible use in event emitters
    // Generates:
    //   interface MappedEventIdentifier {
    //     textAreaCallback: (this: void) => void;
    //   }
    const globalNs = TSNamespaceBuilder.createGlobal();
    const eventIntfLines: string[] = [];

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

      declareEvtLines.push(
        ...tsFncDeclaration.exportJsDocCommentLines(),
        `declare var ${evtFn.name}: ${tsFncDeclaration.exportTsFuncType()};`,
        ""
      );

      eventIntfLines.push(
        `  ${evtFn.eventStringIdentifier}:`,
        ...tsFncDeclaration
          .exportJsDocCommentLines()
          .map((val) => `    ` + val),
        `    ${tsFncDeclaration.exportTsFuncType()};`
      );
    }

    // Populate namespace with single interface declaration statement
    globalNs
      .navigate("tfm")
      .pushStatement([
        "interface MappedEventIdentifier {",
        ...eventIntfLines,
        "}",
      ]);

    return [...declareEvtLines, ...globalNs.exportTstl(), ""];
  },
} as Converter;
