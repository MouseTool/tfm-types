import { fixParam, forParams } from "./common.util";
import {
  FunctionExportable,
  IndependentLiteralExportable,
  InterfaceExportable,
  LiteralExportable,
  UnionExportable,
  anyExportable,
  integerExportable,
  nullExportable,
  stringExportable,
} from "./export-types";
import { DocFunction, DocFunctionType } from "./luahelp-functions";

interface IOverrideModify {
  name: string;
  modify: (lfnc: DocFunction) => void;
}

interface IOverrideAdd {
  name: string;
  lfnc: DocFunction;
}

// Edit modifiers here
const modifiers: IOverrideModify[] = [
  {
    name: "debug.getCurrentThreadName",
    modify: (lfnc) => {
      lfnc.setDescription("Gets the current lua thread name.");
      // Tig forgot to add a return type
      lfnc.setReturnType(
        new DocFunctionType(stringExportable, "the current thread name")
      );
    },
  },

  {
    name: "system.disableChatCommandDisplay",
    modify: (lfnc) => {
      // Just a minor typo in `hide` param
      const pHide = lfnc.params.get("hide");
      pHide.description = pHide.description.replace("hided", "hidden");
    },
  },

  {
    name: "system.giveAdventurePoint",
    modify: (lfnc) => {
      // Standardise param descriptions
      fixParam(lfnc, [
        // Fix invalid param format
        [
          "Achievement code.",
          "the achievement identifier (given by an admin)",
          "achievementCode",
        ],
        ["Amount", "the amount of points to increase", "amount"],
      ]);

      // Clarify permission level
      lfnc.pushDescription("Module team only.");
    },
  },

  {
    name: "system.giveEventGift",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Event elevation only.");
    },
  },

  {
    name: "system.loadFile",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Module team only.");
    },
  },

  {
    name: "system.loadPlayerData",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Module team only.");
    },
  },

  {
    name: "system.luaEventLaunchInterval",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription(
        "Module team only. If `interval` is given, the function is restricted to event elevation only."
      );

      // Arguments are optional
      for (const pName of ["interval", "random"]) {
        lfnc.params.get(pName).defaultValue = nullExportable;
      }

      // TODO: Could use an overload specifying different return types, but not a priority
      // now because the language server doesnt yet differentiate the return types based
      // on the function signature either way
      //--- @overload fun():{ interval: integer, random: integer }?

      // Tig forgot to add a return type
      lfnc.setReturnType(
        new DocFunctionType(
          // { interval: integer, random: integer }
          new InterfaceExportable([
            { key: "interval", valueType: integerExportable },
            { key: "random", valueType: integerExportable },
          ]),
          "the launch interval attributes, if `interval` supplied is `nil`",
          nullExportable
        )
      );
    },
  },

  {
    name: "system.newTimer",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Module team only.");

      // Add function signature for callback
      const pCallback = lfnc.params.get("callback");
      //"fun(timerId:integer, arg1?:any, arg2?:any, arg3?:any, arg4?:any)";
      pCallback.type = new FunctionExportable([
        { name: "timerId", type: integerExportable },
        { name: "arg1", type: anyExportable, isOptional: true },
        { name: "arg2", type: anyExportable, isOptional: true },
        { name: "arg3", type: anyExportable, isOptional: true },
        { name: "arg4", type: anyExportable, isOptional: true },
      ]);

      pCallback.description =
        "The function to call. The first argument of this function is the timer's identifier, followed by those specified from `arg1` to `arg4`.";
    },
  },

  {
    name: "system.openEventShop",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Event elevation only.");
    },
  },

  {
    name: "system.removeTimer",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Module team only.");
    },
  },

  {
    name: "system.saveFile",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Module team only.");
    },
  },

  {
    name: "system.savePlayerData",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Module team only.");
    },
  },

  {
    name: "tfm.exec.addBonus",
    modify: (lfnc) => {
      // Add some clarity
      lfnc.setDescription("Adds a defilante bonus (token) to the map.");

      // Point to enum for TS
      const pType = lfnc.params.get("type");
      pType.setType(
        new IndependentLiteralExportable({
          lua: pType.type.asLua(),
          ts: "tfm.Enums.BonusType",
        })
      );

      // Standardise param descriptions
      fixParam(lfnc, [
        ["x", "the horizontal coordinate of the bonus", "xPosition"],
        ["y", "the vertical coordinate of the bonus", "yPosition"],
        ["id", "the identifier of the bonus"],
        ["angle", "the angle of the bonus"],
        ["visible", "whether the bonus should be visible"],
        [
          "targetPlayer",
          "the player who should see the bonus (if nil, applies to all players)",
        ],
      ]);
    },
  },

  {
    name: "tfm.exec.addImage",
    modify: (lfnc) => {
      // Add clarity to param descs
      fixParam(lfnc, [
        [
          "xPosition",
          "the horizontal offset of the anchor of the image, relative to the game element (0 being the middle of the game element)",
        ],
        [
          "yPosition",
          "the vertical offset of the anchor of the image, relative to the game element (0 being the middle of the game element)",
        ],
        ["scaleX", "the horizontal (width) scale of the image"],
        ["scaleY", "the vertical (height) scale of the image"],
        [
          "rotation",
          "the opacity of the image, from 0 (transparent) to 1 (opaque)",
        ],
        [
          "alpha",
          "the opacity of the image, from 0 (transparent) to 1 (opaque)",
        ],
        [
          "anchorX",
          "the horizontal offset (in 0 to 1 scale) of the image's anchor, relative to the image (0 being the left of the image)",
        ],
        [
          "anchorY",
          "the vertical offset (in 0 to 1 scale) of the image's anchor, relative to the image (0 being the top of the image)",
        ],
      ]);
    },
  },

  {
    name: "tfm.exec.addJoint",
    modify: (lfnc) => {
      // Point jointDef to custom type
      const pJoint = lfnc.params.get("jointDef");
      pJoint.setType(new LiteralExportable("tfm.JointDef"));
      pJoint.setDescription("the joint configuration");
    },
  },

  {
    name: "tfm.exec.addNPC",
    modify: (lfnc) => {
      lfnc.setDescription("Spawns an NPC.");

      // Point npcDef to custom type
      const pNpc = lfnc.params.get("npcDef");
      pNpc.setType(new LiteralExportable("tfm.NPCDef"));
      pNpc.description = "the NPC configuration";
    },
  },

  {
    name: "tfm.exec.addPhysicObject",
    modify: (lfnc) => {
      // Point bodyDef to custom type
      const pBody = lfnc.params.get("bodyDef");
      pBody.setType(new LiteralExportable("tfm.BodyDef"));
      pBody.setDescription("the ground configuration");
    },
  },

  {
    name: "tfm.exec.addShamanObject",
    modify: (lfnc) => {
      // Point options to custom type and make optional
      const pOptions = lfnc.params.get("options");
      pOptions.type = new LiteralExportable("tfm.ShamanObjOpt");
      pOptions.description = "the shaman object configuration";
      pOptions.defaultValue = nullExportable;
    },
  },

  {
    name: "tfm.exec.attachBalloon",
    modify: (lfnc) => {
      lfnc.setDescription(
        "Spawns and attaches a ghost balloon to a player, or detaches all balloons."
      );

      // Add clarity to param descs
      fixParam(lfnc, [
        ["yes", "whether the balloon should be attached", "attach"],
        [
          "color",
          "the color type of the balloon (between 1 and 4)",
          "colorType",
        ],
        // standardise
        [
          "transparent",
          "whether the spawned balloon should be transparent",
          "ghost",
        ],
        ["speed", "the vertical speed of the balloon"],
      ]);

      // Tig forgot to add a return type
      lfnc.setReturnType(
        new DocFunctionType(
          integerExportable,
          "the shaman object identifier of the balloon"
        )
      );
    },
  },

  {
    name: "tfm.exec.chatMessage",
    modify: (lfnc) => {
      // Clarify permission level
      lfnc.pushDescription("Module team only.");
    },
  },

  {
    name: "tfm.exec.freezePlayer",
    modify: (lfnc) => {
      // Standardise description
      lfnc.setDescription("Freezes the selected player.");

      // Add clarity to param descs
      fixParam(lfnc, [
        ["playerName", "the player to freeze"],
        ["freeze", "whether the player should be frozen"],
        ["displayIce", "whether the ice sprite should be shown on the player"],
      ]);
    },
  },

  {
    name: "tfm.exec.getPlayerSync",
    modify: (lfnc) => {
      // Add clarity to description
      lfnc.setDescription(
        "Gets the player who is the room's current synchronizer."
      );

      // Clarify permission level
      lfnc.pushDescription("Module team only.");

      // Tig forgot to add a return type
      lfnc.setReturnType(
        new DocFunctionType(stringExportable, "the player's nickname")
      );
    },
  },

  {
    name: "tfm.exec.movePlayer",
    modify: (lfnc) => {
      // 20220804 update:
      // Correct default value of {x,y}Speed from `0` to `nil` and clarify the behavior of `nil`
      for (const pName of ["xSpeed", "ySpeed"]) {
        const speedParam = lfnc.params.get(pName);
        speedParam.defaultValue = nullExportable;
        speedParam.setDescription(
          speedParam.description + " (if nil, does not change the speed value)"
        );
      }
    },
  },

  {
    name: "tfm.exec.newGame",
    modify: (lfnc) => {
      // mapCode can be integer
      const pMapCode = lfnc.params.get("mapCode");
      pMapCode.setType(new UnionExportable([pMapCode.type, integerExportable]));
    },
  },

  {
    name: "tfm.exec.playMusic",
    modify: (lfnc) => {
      // Move link to param desc
      lfnc.setDescription("Plays a music. A music can be stopped.");

      forParams(lfnc, [
        // Add clarity to param desc
        [
          "music",
          (par) => {
            par.setDescription(
              "The path of the URL to the music file. Musics list can be found here : http://audio.atelier801.com/sounds.html"
            );
          },
        ],

        // 1. Channel -> channel
        // 2. Add additional info
        [
          "Channel",
          (par) => {
            par.setOverrideName("channel");
            par.setDescription("Channel of the music.");
            par.addDescription(
              "    - Only one music can be played per channel. Any music playing on this channel prior will be stopped."
            );
            //par.addDescription("    - You can use « \"musique\" » to target the global background music channel.")
          },
        ],

        // `targetPlayer` should be string not int
        [
          "targetPlayer",
          (par) => {
            par.setType(stringExportable);
          },
        ],
      ]);
    },
  },

  {
    name: "tfm.exec.playSound",
    modify: (lfnc) => {
      // Move link to param desc
      lfnc.setDescription("Plays a sound.");

      forParams(lfnc, [
        // Add clarity to param desc
        [
          "sound",
          (par) => {
            par.setDescription(
              "The path of the URL to the sound file. Sounds list can be found here : http://audio.atelier801.com/sounds.html"
            );
          },
        ],

        // `targetPlayer` should be string not int
        [
          "targetPlayer",
          (par) => {
            par.setType(stringExportable);
          },
        ],
      ]);
    },
  },

  {
    name: "tfm.exec.removeBonus",
    modify: (lfnc) => {
      // Add some clarity
      lfnc.setDescription("Removes a defilante bonus (token).");

      // Standardise param descriptions
      fixParam(lfnc, [
        ["id", "the identifier of the bonus"],
        [
          "targetPlayer",
          "the player whom should have the bonus removed (if nil, applies to all players)",
        ],
      ]);
    },
  },

  {
    name: "tfm.exec.setPlayerNightMode",
    modify: (lfnc) => {
      // `playerName` has a default value of `nil`
      lfnc.params.get("playerName").defaultValue = nullExportable;
    },
  },

  {
    name: "tfm.exec.setPlayerSync",
    modify: (lfnc) => {
      // Add clarity to description
      lfnc.setDescription(
        "Changes the room's current synchronizer (or resets it)."
      );

      // Clarify permission level
      lfnc.pushDescription("Module team only.");

      forParams(lfnc, [
        // 1. Standardise param descriptions
        // 2. String literal type for "none"
        [
          "playerName",
          (par) => {
            par.setDescription(
              'the player who should become the room sync (use `nil` to let the server decide, or `"none"` to disable sync)'
            );
            // `playerName` has a default value of `nil`
            par.defaultValue = nullExportable;
            par.setType(
              new UnionExportable([par.type, new LiteralExportable('"none"')])
            );
          },
        ],
      ]);
    },
  },

  {
    name: "tfm.exec.setWorldGravity",
    modify: (lfnc) => {
      // Add clarity to description
      lfnc.setDescription(
        "Changes the world acceleration along the horizontal (wind) and vertical (gravity) axes."
      );

      // Standardise param descriptions
      fixParam(lfnc, [
        ["x", "the horizontal acceleration of the world", "xAcceleration"],
        ["y", "the vertical acceleration of the world", "yAcceleration"],
      ]);
    },
  },

  {
    name: "tfm.exec.setBackgroundColor",
    modify: (lfnc) => {
      // Add clarity to description
      lfnc.setDescription("Sets the map background color.");

      // Standardise param descriptions
      fixParam(lfnc, [["color", "the background color, in hex code format"]]);
    },
  },

  {
    name: "tfm.exec.stopMusic",
    modify: (lfnc) => {
      forParams(lfnc, [
        // 1. Channel -> channel
        // 2. Add additional info
        [
          "Channel",
          (par) => {
            par.setOverrideName("channel");
            par.setDescription("Channel of the music.");
            par.addDescription(
              "    - Only one music can be played per channel. Any music playing on this channel prior will be stopped."
            );
            par.addDescription(
              '    - You can use « "musique" » to target the global background music channel.'
            );
          },
        ],

        // `targetPlayer` should be string not int
        [
          "targetPlayer",
          (par) => {
            par.setType(stringExportable);
          },
        ],
      ]);
    },
  },

  {
    name: "ui.addPopup",
    modify: (lfnc) => {
      // Make targetPlayer optional
      lfnc.params.get("targetPlayer").defaultValue = nullExportable;
    },
  },
];

// Edit adders here
// TODO: not supported
const adders: IOverrideAdd[] = [];

type OverrideType =
  | ({ type: "modify" } & IOverrideModify)
  | ({ type: "add" } & IOverrideAdd);

export const overrides: Record<string, OverrideType> = {};

// Populate record
for (const m of modifiers) {
  overrides[m.name] = {
    type: "modify",
    ...m,
  };
}
for (const m of adders) {
  overrides[m.name] = {
    type: "add",
    ...m,
  };
}
