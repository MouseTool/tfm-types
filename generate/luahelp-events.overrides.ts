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
  evtFn: DocEvent,
  replace: [name: string, desc?: string, overrideName?: string][]
) {
  for (const [name, desc, overrideName] of replace) {
    const par = evtFn.params.get(name);
    if (desc) par.setDescription(desc);
    if (overrideName) par.setOverrideName(overrideName);
  }
}

// Edit modifiers here
const modifiers: IOverrideModify[] = [
  {
    name: "eventContactListener",
    modify: (evtFn) => {
      // Point to enum for TS
      const pGroundId = evtFn.params.get("groundId");
      pGroundId.setType({
        asLua: pGroundId.type.asLua,
        asTs: () => "tfm.enum.GroundType",
      });

      // Point to proper interface
      evtFn.params
        .get("contactInfos")
        .setType(new LiteralExportable("tfm.ContactDef"));
    },
  },
];

type OverrideType = { type: "modify" } & IOverrideModify;

export const overrides: Record<string, OverrideType> = {};

// Populate record
for (const m of modifiers) {
  overrides[m.name] = {
    type: "modify",
    ...m,
  };
}
