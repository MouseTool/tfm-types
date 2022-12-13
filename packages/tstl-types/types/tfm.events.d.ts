// !! This file is generated by an NPM script. !!

/**
 * This event is triggered when a player uses a chat command (a message beginning with « ! »).
 * @param playerName the player who sent the command
 * @param command the message (without the initial « ! »)
 */
declare var eventChatCommand: (this: void, playerName: string, command: string) => void;

/**
 * This event is triggered when a player talks in the room chat.
 * @param playerName the player who sent the message
 * @param message the message
 */
declare var eventChatMessage: (this: void, playerName: string, message: string) => void;

/**
 * This event is triggered when the player does an emote.
 * @param playerName the player who did the emote
 * @param emoteType the type of emote played
 * @param emoteParam the parameter used with the emote (only applies to the flag one)
 */
declare var eventEmotePlayed: (this: void, playerName: string, emoteType: tfm.Enums.EmoteType, emoteParam: string | null) => void;

/**
 * This event is triggered when a file gets fully loaded.
 * @param fileNumber the file identifier
 * @param fileData the file data
 */
declare var eventFileLoaded: (this: void, fileNumber: string, fileData: string) => void;

/**
 * This event is triggered when a file gets saved.
 * @param fileNumber the name of the file
 */
declare var eventFileSaved: (this: void, fileNumber: string) => void;

/**
 * This event is triggered when a player presses a key.
 * @param playerName the player who typed the key
 * @param keyCode the code of the typed key
 * @param down whether it was the press event, or the release one
 * @param xPlayerPosition the horizontal coordinate of the player when he or she typed the key
 * @param yPlayerPosition the vertical coordinate of the player when he or she typed the key
 * @param xPlayerVelocity the horizontal velocity of the player when he or she typed the key
 * @param yPlayerVelocity the vertical velocity of the player when he or she typed the key
 */
declare var eventKeyboard: (this: void, playerName: string, keyCode: tfm.integer, down: boolean, xPlayerPosition: tfm.integer, yPlayerPosition: tfm.integer, xPlayerVelocity: number, yPlayerVelocity: number) => void;

/**
 * This event is triggered when a player perfoms a mouse click.
 * @param playerName the player who made the click
 * @param xMousePosition the horizontal coordinate of the mouse click
 * @param yMousePosition the vertical coordinate of the mouse click
 */
declare var eventMouse: (this: void, playerName: string, xMousePosition: tfm.integer, yMousePosition: tfm.integer) => void;

/**
 * This event occurs every 500 milliseconds.
 * @param elapsedTime the time in milliseconds elapsed since the beginning of the round
 * @param remainingTime the time in milliseconds remaining before the next round
 */
declare var eventLoop: (this: void, elapsedTime: tfm.integer, remainingTime: tfm.integer) => void;

/**
 * This event is triggered when a new round begins.
 */
declare var eventNewGame: (this: void) => void;

/**
 * This event is triggered when a new player joins the room.
 * @param playerName the player who joined the room
 */
declare var eventNewPlayer: (this: void, playerName: string) => void;

/**
 * This event is triggered when player data gets loaded.
 * @param playerName the player whose data got loaded
 * @param playerData the data about the player
 */
declare var eventPlayerDataLoaded: (this: void, playerName: string, playerData: string) => void;

/**
 * This event is triggered when a player dies.
 * @param playerName the player who died
 */
declare var eventPlayerDied: (this: void, playerName: string) => void;

/**
 * This event is triggered when a player gets the cheese.
 * @param playerName the player who got the cheese
 */
declare var eventPlayerGetCheese: (this: void, playerName: string) => void;

/**
 * This event is triggered when a player grab a defilante bonus.
 * @param playerName The player who grabbed the bonus.
 * @param bonusId Bonus identifier.
 */
declare var eventPlayerBonusGrabbed: (this: void, playerName: string, bonusId: tfm.integer) => void;

/**
 * This event is triggered when a player leaves the room.
 * @param playerName the player who left the room
 */
declare var eventPlayerLeft: (this: void, playerName: string) => void;

/**
 * This event is triggered when a player turns into a vampire.
 * @param playerName the player who turned into a vampire
 */
declare var eventPlayerVampire: (this: void, playerName: string) => void;

/**
 * This event triggers when a player enters the hole.
 * @param playerName the player who entered the hole
 * @param timeElapsed the time in milliseconds elapsed since the beginning of the round
 * @param timeElapsedSinceRespawn the time in milliseconds elapsed since the last respawn
 */
declare var eventPlayerWon: (this: void, playerName: string, timeElapsed: tfm.integer, timeElapsedSinceRespawn: tfm.integer) => void;

/**
 * This event is triggered when a player respawns.
 * @param playerName the player who respawned
 */
declare var eventPlayerRespawn: (this: void, playerName: string) => void;

/**
 * This event is triggered when a player meeps.
 * @param playerName the player who meeped
 * @param xPosition the horizontal coordinate of the player when they meeped
 * @param yPosition the vertical coordinate of the player when they meeped
 */
declare var eventPlayerMeep: (this: void, playerName: string, xPosition: tfm.integer, yPosition: tfm.integer) => void;

/**
 * This event is triggered when a player answers a popup (only type 1 and 2 popups).
 * @param popupId the popup identifier
 * @param playerName the player who answered the popup
 * @param answer the player's answer
 *     - yes or no for a type 1 popup
 *     - any string for a type 2 poup
 */
declare var eventPopupAnswer: (this: void, popupId: tfm.integer, playerName: string, answer: string) => void;

/**
 * This event is triggered when a player starts summoning a shaman object.
 * @param playerName the player who started summoning
 * @param objectType the kind of shaman object being summoned
 * @param xPosition the horizontal coordinate of the summoning point
 * @param yPosition the vertical coordinate of the summoning point
 * @param angle the rotation angle of the object being summoned
 */
declare var eventSummoningStart: (this: void, playerName: string, objectType: tfm.integer, xPosition: tfm.integer, yPosition: tfm.integer, angle: tfm.integer) => void;

/**
 * This event is triggered when a player cancels an object invocation.
 * @param playerName the player who stopped summoning
 */
declare var eventSummoningCancel: (this: void, playerName: string) => void;

/**
 * This event triggers when a player has finished an invocation.
 * @param playerName the player who summoned the object
 * @param objectType the kind of the object
 * @param xPosition the horizontal position of the summoned object
 * @param yPosition the vertical position of the summoned object
 * @param angle the rotation angle of the summoned object
 * @param objectDescription the object table description as it would appear in the room's objectList
 */
declare var eventSummoningEnd: (this: void, playerName: string, objectType: tfm.integer, xPosition: tfm.integer, yPosition: tfm.integer, angle: tfm.integer, objectDescription: object) => void;

/**
 * This event is triggered when a player clicks a text event.
 * Text event links are anchors tags links beginning with the "event:" string (e.g. : Click here).
 * If the link eventName begins with '#clear,' the text area will be cleared, and the received eventName will be the text following the coma.
 * @param textAreaId the text area identifier
 * @param playerName the player who clicked
 * @param eventName the name of the clicked text event
 */
declare var eventTextAreaCallback: (this: void, textAreaId: tfm.integer, playerName: string, eventName: string) => void;

/**
 * This event is triggered when a player chooses a color with a color picker.
 * @param colorPickerId the color picker identifier
 * @param playerName the player who picked a color
 * @param color the color picked (-1 if the player didn't picked one))
 */
declare var eventColorPicked: (this: void, colorPickerId: tfm.integer, playerName: string, color: tfm.integer) => void;

/**
 * This event is triggered when a player hit a ground with a contact listener.
 * @param playerName the player who hit the ground
 * @param groundId ground identifier
 * @param contactInfos Collision informations
 */
declare var eventContactListener: (this: void, playerName: string, groundId: tfm.integer, contactInfos: tfm.ContactDef) => void;

/**
 * This event is triggered when a player click on a NPC.
 * @param playerName The player who talk to the NPC
 * @param npcName The NPC name
 */
declare var eventTalkToNPC: (this: void, playerName: string, npcName: string) => void;
