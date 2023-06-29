import {
  anyExportable,
  FunctionExportable,
  IndependentLiteralExportable,
  integerExportable,
  InterfaceExportable,
  LiteralExportable,
  nullExportable,
  stringExportable,
  UnionExportable,
} from "./export-types";
import { DocEvent } from "./luahelp-events";

interface IOverrideModify {
  name: string;
  modify: (evtFn: DocEvent) => void;
}

// Edit modifiers here
const modifiers: IOverrideModify[] = [
  {
    name: "eventEmotePlayed",
    modify: (evtFn) => {
      // Point to enum for TS
      const pEmoteType = evtFn.params.get("emoteType");
      pEmoteType.setType(
        new IndependentLiteralExportable({
          lua: pEmoteType.type.asLua(),
          ts: "tfm.Enums.EmoteType",
        })
      );

      // Optional emoteParam
      const pEmoteParam = evtFn.params.get("emoteParam");
      pEmoteParam.setType(
        new UnionExportable([pEmoteParam.type, nullExportable])
      );
    },
  },

  {
    name: "eventContactListener",
    modify: (evtFn) => {
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
