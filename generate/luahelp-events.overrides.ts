import {
  anyExportable,
  FunctionExportable,
  IndependentLiteralExportable,
  integerExportable,
  InterfaceExportable,
  LiteralExportable,
  nullExportable,
  stringExportable,
} from "./exportTypes";
import { DocEvent } from "./luahelp-events";

interface IOverrideModify {
  name: string;
  modify: (evtFn: DocEvent) => void;
}

function fixParam(
  levt: DocEvent,
  replace: [name: string, desc?: string, overrideName?: string][]
) {
  for (const [name, desc, overrideName] of replace) {
    const par = levt.params.get(name);
    if (desc) par.setDescription(desc);
    if (overrideName) par.setOverrideName(overrideName);
  }
}

// Edit modifiers here
const modifiers: IOverrideModify[] = [
  {
    name: "eventLoop",
    modify: (evtFn) => {
      // Add clarity to description
      evtFn.setDescription("It loop the loopies loops.");
    },
  },
];

type OverrideType =
  | ({ type: "modify" } & IOverrideModify)

export const overrides: Record<string, OverrideType> = {};

// Populate record
for (const m of modifiers) {
  overrides[m.name] = {
    type: "modify",
    ...m,
  };
}
