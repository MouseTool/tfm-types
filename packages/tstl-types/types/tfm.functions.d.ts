// !! This file is generated by an NPM script. !!

/** @noSelfInFile */
declare namespace debug {
  /**
   * Deactivates the events log.
   * @param activate whether it should be active (default `true`)
   */
  export function disableEventLog(activate?: boolean): void
  /**
   * Gets the current lua thread name.
   * @returns the current thread name
   */
  export function getCurrentThreadName(): string
}
declare namespace system {
  /**
   * Listens to the player's keyboard events.
   * @param playerName the player you want to listen keyboard events from
   * @param keyCode the code of the key you want to listen
   *     - to accurately listen for player movement (both arrows and wasd/zqsd keys), you can use 0 (left), 1 (up), 2 (right) or 3 (down)
   *     - regular AS3 keycodes can be found on http://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/ui/Keyboard.html
   * @param down whether it should listen for the press event, or the release one
   * @param activate whether it should be active (default `true`)
   */
  export function bindKeyboard(playerName: string, keyCode: tfm.integer, down: boolean, activate?: boolean): void
  /**
   * Listens to a player's mouse events.
   * @param playerName the player you want to listen mouse events from
   * @param active whether it should be active (default `true`)
   */
  export function bindMouse(playerName: string, active?: boolean): void
  /**
   * Prevents a module command (commands starting with « ! ») to be displayed in the room. If the supplied command is nil, the parameter will apply to all the commands.
   * @param command the command (without the initial « ! ») to hide (default `null`)
   * @param hide whether the command should be hidden (default `true`)
   */
  export function disableChatCommandDisplay(command?: string, hide?: boolean): void
  /**
   * Deactivates the lua script running.
   */
  export function exit(): void
  /**
   * Gives an event reward to the targeted player.
   *
   * Event elevation only.
   * @param playerName the player to give the gift to
   * @param giftCode the gift identifier (given by an admin)
   */
  export function giveEventGift(playerName: string, giftCode: string): void
  /**
   * Requests the loading of a data file. The event eventFileLoaded is triggered when the file gets loaded.
   *
   * Module team only.
   * @param fileNumber the identifier of the file to load (default `0`)
   * @returns whether the loading got started
   */
  export function loadFile(fileNumber?: tfm.integer): boolean
  /**
   * Requests the loading of the player's data for this module. The event eventPlayerDataLoaded is triggered when the player data gets loaded.
   *
   * Module team only.
   * @param playerName the player about whom you want to get the data
   * @returns whether the loading got started
   */
  export function loadPlayerData(playerName: string): boolean
  /**
   * Set or get the timer interval between two events.
   *
   * Module team only. If `interval` is given, the function is restricted to event elevation only.
   * @param interval Timer interval in min (default 40 min), can't be less than 40 min. (default `null`)
   * @param random Random added  interval in min (default 20 min). (default `null`)
   * @returns the launch interval attributes, if `interval` supplied is `nil`
   */
  export function luaEventLaunchInterval(interval?: tfm.integer, random?: tfm.integer): { interval: tfm.integer, random: tfm.integer } | undefined
  /**
   * Creates a new timer to call a function after a delay, once or continuously.
   *
   * Module team only.
   * @param callback The function to call. The first argument of this function is the timer's identifier, followed by those specified from `arg1` to `arg4`.
   * @param time the number of milliseconds that the function call should be delayed by
   * @param loop whether the function call should loop or happen only once (default `false`)
   * @param arg1 1st argument of the callback function (default `null`)
   * @param arg2 2nd argument of the callback function (default `null`)
   * @param arg3 3rd argument of the callback function (default `null`)
   * @param arg4 4th argument of the callback function (default `null`)
   * @returns the new timer id
   */
  export function newTimer(callback: (this: void, timerId: tfm.integer, arg1?: any, arg2?: any, arg3?: any, arg4?: any) => void, time: tfm.integer, loop?: boolean, arg1?: any, arg2?: any, arg3?: any, arg4?: any): tfm.integer
  /**
   * Open the shop of the specified event.
   *
   * Event elevation only.
   * @param eventName Event name.
   * @param playerName Target player name.
   */
  export function openEventShop(eventName: string, playerName: string): void
  /**
   * Destroys a timer.
   *
   * Module team only.
   * @param timerId the identifier of the timer to stop
   */
  export function removeTimer(timerId: tfm.integer): void
  /**
   * Requests the saving of a data file (throttled to one per minute). The event eventFileSaved is triggered when the file get saved.
   *
   * Module team only.
   * @param data the data to store in the file
   * @param fileNumber the identifier (from 0 to 99) of the file to write the data in (default `0`)
   * @returns whether the saving got started
   */
  export function saveFile(data: string, fileNumber?: tfm.integer): boolean
  /**
   * Saves module data about a player. Please note that this data is per player and per Lua dev, so take care not to overwrite data from another one of your modules.
   *
   * Module team only.
   * @param playerName the player about whom you want to save data
   * @param data the player data to save
   */
  export function savePlayerData(playerName: string, data: string): void
  /**
   * Set the login event banner.
   * @param bannerId Banner id.
   */
  export function setLuaEventBanner(bannerId: tfm.integer): void
}
declare namespace tfm {
  export namespace exec {
    /**
     * Adds a defilante bonus (token) to the map.
     * @param type Bonus type (see tfm.enum.bonus) (default `1`)
     * @param xPosition the horizontal coordinate of the bonus (default `0`)
     * @param yPosition the vertical coordinate of the bonus (default `0`)
     * @param id the identifier of the bonus (default `0`)
     * @param angle the angle of the bonus (default `0`)
     * @param visible whether the bonus should be visible (default `true`)
     * @param targetPlayer the player who should see the bonus (if nil, applies to all players) (default `null`)
     */
    export function addBonus(type?: tfm.Enums.BonusType, xPosition?: tfm.integer, yPosition?: tfm.integer, id?: tfm.integer, angle?: tfm.integer, visible?: boolean, targetPlayer?: string): void
    /**
     * Adds conjuration to the map. Note: Grid coordinate are regular coordinate divided by 10 (as conjuration is a 10x10 pixel square).
     * @param xPosition the horizontal grid coordinate of the conjuration
     * @param yPosition the vertical grid coordinate of the conjuration
     * @param duration the duration of the conjuration in milliseconds (default `10000`)
     */
    export function addConjuration(xPosition: tfm.integer, yPosition: tfm.integer, duration?: tfm.integer): void
    /**
     * Displays an image on the map.
     * @param imageId the image identifier
     * @param target the game element to attach the image to
     *     - #mobileId
     *     - =mobileId (keep current sprite)
     *     - $playerName (on the mouse sprite)
     *     - %playerName (with the mouse sprite removed)
     *     - ?backgroundLayerDepth
     *     - _groundLayerDepth
     *     - !foregroundLayerDepth
     *     - &fixedLayerDepthBeforeLuaInterfaces
     *     - :fixedLayerDepthBehindLuaInterfaces
     *     - ~fixedLayerDepthWithLuaInterfaces
     *     - +physicObjectId
     * @param xPosition the horizontal offset of the anchor of the image, relative to the game element (0 being the middle of the game element) (default `0`)
     * @param yPosition the vertical offset of the anchor of the image, relative to the game element (0 being the middle of the game element) (default `0`)
     * @param targetPlayer the player who will see the image (if nil, applies to all players) (default `null`)
     * @param scaleX the horizontal (width) scale of the image (default `1`)
     * @param scaleY the vertical (height) scale of the image (default `1`)
     * @param rotation the opacity of the image, from 0 (transparent) to 1 (opaque) (default `0`)
     * @param alpha the opacity of the image, from 0 (transparent) to 1 (opaque) (default `1`)
     * @param anchorX the horizontal offset (in 0 to 1 scale) of the image's anchor, relative to the image (0 being the left of the image) (default `0`)
     * @param anchorY the vertical offset (in 0 to 1 scale) of the image's anchor, relative to the image (0 being the top of the image) (default `0`)
     * @returns the image identifier
     */
    export function addImage(imageId: string, target: string, xPosition?: tfm.integer, yPosition?: tfm.integer, targetPlayer?: string, scaleX?: number, scaleY?: number, rotation?: number, alpha?: number, anchorX?: number, anchorY?: number): tfm.integer
    /**
     * Adds a joint between two physic objects. . Note: In map XML codes, you can also add a « lua="id" » property in a joint definition to be able to interact with it with LUA code.
     * @param id the identifier of the joint
     * @param ground1 the first ground the joint will affect
     * @param ground2 the second ground the joint will affect
     * @param jointDef the joint configuration
     *     - type (Int): 0 -> distance joint, 1 -> prismatic joint, 2 -> pulley joint, 3 -> revolute joint
     *     - point1 (String "x,y"): location of the ground1 anchor (default: the ground1's center)
     *     - point2 (String "x,y"): location of the ground2 anchor (default: the ground2's center), only used with distance and pulley joints
     *     - point3 (String "x,y"), point4 (String "x,y"): locations of the pulley's anchors, only used with pulley joints
     *     - frequency (Float), damping (Float): distance joints' frequency and damping ratio
     *     - axis (String "x,y"), angle (Int): prismatic joints' axis and angle
     *     - limit1 (Float), limit2 (Float), forceMotor (Float), speedMotor (Float): prismatic and revolute joints' translation/rotation limits and motors
     *     - ratio (Float): revolute joints' ratio
     *     - line (Int), color (Int), alpha (Float), foreground (Boolean): if none of these properties is defined, the joint won't be drawn
     */
    export function addJoint(id: tfm.integer, ground1: tfm.integer, ground2: tfm.integer, jointDef: tfm.JointDef): void
    /**
     * Spawns an NPC.
     * @param name NPC name.
     * @param npcDef the NPC configuration
     *     - title (Int): NPC title.
     *     - look (String): NPC look.
     *     - x (int): X position.
     *     - y (int): Y position.
     *     - female (bool): Set True if the NPC is female.
     *     - lookLeft (bool): Set True to make the NPC look to the left.
     *     - lookAtPlayer (bool): Set True to make the NPC look to the player.
     *     - interactive (Boolean): If true, player will be able to click on it.
     * @param targetPlayer the player who will see the NPC (if nil, applies to all players) (default `null`)
     */
    export function addNPC(name: string, npcDef: tfm.NPCDef, targetPlayer?: string): void
    /**
     * Spawns a ground.
     * @param id the identifier of the physic object
     * @param xPosition the horizontal coordinate of the center of the ground
     * @param yPosition the vertical coordinate of the center of the ground
     * @param bodyDef the ground configuration
     *     - type (Int), width (Int), height (Int), foreground (Boolean), friction (Float), restitution (Float), angle (Int), color (Int), miceCollision (Boolean), groundCollision (Boolean)
     *     - dynamic (Boolean), fixedRotation (Boolean), mass (Int), linearDamping (Float), angularDamping (Float) for dynamic grounds, contactListener (Boolean)
     */
    export function addPhysicObject(id: tfm.integer, xPosition: tfm.integer, yPosition: tfm.integer, bodyDef: tfm.BodyDef): void
    /**
     * Spawns a shaman object.
     * @param objectType the type of the shaman object to spawn
     * @param xPosition the horizontal position of the spawn
     * @param yPosition the vertical position of the spawn
     * @param angle the rotation angle of the object, in degrees (default `0`)
     * @param xSpeed the horizontal speed of the object (default `0`)
     * @param ySpeed the vertical speed of the object (default `0`)
     * @param ghost whether the spawned object should be transparent (default `false`)
     * @param options the shaman object configuration (default `null`)
     * @returns the shaman object identifier
     */
    export function addShamanObject(objectType: tfm.integer, xPosition: tfm.integer, yPosition: tfm.integer, angle?: tfm.integer, xSpeed?: tfm.integer, ySpeed?: tfm.integer, ghost?: boolean, options?: tfm.ShamanObjOpt): tfm.integer
    /**
     * Spawns and attaches a ghost balloon to a player, or detaches all balloons.
     * @param playerName the player's nickname
     * @param attach whether the balloon should be attached (default `true`)
     * @param colorType the color type of the balloon (between 1 and 4) (default `1`)
     * @param ghost whether the spawned balloon should be transparent (default `false`)
     * @param speed the vertical speed of the balloon (default `1`)
     * @returns the shaman object identifier of the balloon
     */
    export function attachBalloon(playerName: string, attach?: boolean, colorType?: tfm.integer, ghost?: boolean, speed?: number): tfm.integer
    /**
     * Changes the size of a player.
     * @param playerName the player's nickname
     * @param size the new size of the player (between 0.1 and 5) (default `1`)
     */
    export function changePlayerSize(playerName: string, size?: number): void
    /**
     * Displays a chat message.
     *
     * Module team only.
     * @param message the chat message to display
     * @param playerName the player who will get the message (if nil, applies to all players) (default `null`)
     */
    export function chatMessage(message: string, playerName?: string): void
    /**
     * Deactivates the automatic afk death.
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableAfkDeath(activate?: boolean): void
    /**
     * Deactivates all shaman skills.
     * @param active whether the deactivation should be active (default `true`)
     */
    export function disableAllShamanSkills(active?: boolean): void
    /**
     * Deactivates the automatic renewal of rounds.
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableAutoNewGame(activate?: boolean): void
    /**
     * Deactivates the automatic scoring management.
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableAutoScore(activate?: boolean): void
    /**
     * Deactivates the automatic selection of shaman.
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableAutoShaman(activate?: boolean): void
    /**
     * Deactivates the automatic remaining time change to 20s (when the shaman dies for example).
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableAutoTimeLeft(activate?: boolean): void
    /**
     * Disables the effects of the /debug command.
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableDebugCommand(activate?: boolean): void
    /**
     * Disables the minimalist mode.
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableMinimalistMode(activate?: boolean): void
    /**
     * Disables the /mort command.
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableMortCommand(activate?: boolean): void
    /**
     * Deactivates physical consumables (like in racing and bootcamp rooms).
     * @param active whether the deactivation should be active (default `true`)
     */
    export function disablePhysicalConsumables(active?: boolean): void
    /**
     * Enables or disables the shaman objects prespawn preview.
     * @param display whether the prespawn preview should not be displayed (default `true`)
     */
    export function disablePrespawnPreview(display?: boolean): void
    /**
     * Disables the effects of the /watch command.
     * @param activate whether the deactivation should be active (default `true`)
     */
    export function disableWatchCommand(activate?: boolean): void
    /**
     * Displays a particle.
     * @param particleType the kind of particle you want to display
     * @param xPosition the horizontal coordinate of the particle
     * @param yPosition the vertical coordinate of the particle
     * @param xSpeed the horizontal speed of the particle (default `0`)
     * @param ySpeed the vertical speed of the particle (default `0`)
     * @param xAcceleration the horizontal acceleration of the particle (default `0`)
     * @param yAcceleration the vertical acceleration of the particle (default `0`)
     * @param targetPlayer the player who should see the particle (if nil, applies to all players) (default `null`)
     */
    export function displayParticle(particleType: tfm.integer, xPosition: tfm.integer, yPosition: tfm.integer, xSpeed?: number, ySpeed?: number, xAcceleration?: number, yAcceleration?: number, targetPlayer?: string): void
    /**
     * Throws an explosion.
     * @param xPosition the horizontal coordinate of the center of the explosion
     * @param yPosition the vertical coordinate of the center of the explosion
     * @param power the maximum power of the explosion
     * @param radius the explosion radius (players further away won't be affected)
     * @param miceOnly whether the explosion should affect only mice, or objects too (default `false`)
     */
    export function explosion(xPosition: tfm.integer, yPosition: tfm.integer, power: tfm.integer, radius: tfm.integer, miceOnly?: boolean): void
    /**
     * Freezes the selected player.
     * @param playerName the player to freeze
     * @param freeze whether the player should be frozen (default `true`)
     * @param displayIce whether the ice sprite should be shown on the player (default `true`)
     */
    export function freezePlayer(playerName: string, freeze?: boolean, displayIce?: boolean): void
    /**
     * Gets the player who is the room's current synchronizer.
     *
     * Module team only.
     * @returns the player's nickname
     */
    export function getPlayerSync(): string
    /**
     * Gives the cheese to a player.
     * @param playerName the player who should get the cheese
     */
    export function giveCheese(playerName: string): void
    /**
     * Gives consumables to the targeted player.
     * @param playerName the player to give the gift to
     * @param consumableId the consumable identifier
     * @param amount the amount of consumables to give (default `"1"`)
     */
    export function giveConsumables(playerName: string, consumableId: string, amount?: string): void
    /**
     * Gives the meep competence to a player, or removes it.
     * @param playerName the player's nickname
     * @param canMeep whether the player should be able to meep (default `true`)
     */
    export function giveMeep(playerName: string, canMeep?: boolean): void
    /**
     * Gives the transformations to a player, or removes them.
     * @param playerName the player's nickname
     * @param canTransform whether the player should be able to use transformations (default `true`)
     */
    export function giveTransformations(playerName: string, canTransform?: boolean): void
    /**
     * Kills the selected player.
     * @param playerName the player to kill
     */
    export function killPlayer(playerName: string): void
    /**
     * Allows to link players like in soulmate maps.
     * @param playerName1 the first player's nickname
     * @param playerName2 the second player's nickname
     * @param linked whether the two players should be linked (default `true`)
     */
    export function linkMice(playerName1: string, playerName2: string, linked?: boolean): void
    /**
     * Lowers the synchronization delay of a player to 400ms max
     * @param playerName the player who should have a lower sync delay
     */
    export function lowerSyncDelay(playerName: string): void
    /**
     * Defines the speed and position of a shaman object.
     * @param objectId the shaman object identifier
     * @param xPosition the horizontal coordinate of the point where the object will be moved
     * @param yPosition the vertical coordinate of the point where the object will be moved
     * @param positionOffset whether the specified position is an offset to apply to the current one, or the absolute one (default `false`)
     * @param xSpeed the horizontal coordinate of the speed to give to the object (default `0`)
     * @param ySpeed the vertical coordinate of the speed to give to the object (default `0`)
     * @param speedOffset whether the specified speed is an offset to apply to the current one, or the absolute one (default `false`)
     * @param angle the angle of the the object (default `0`)
     * @param angleOffset whether the specified angle is an offset to apply to the current one, or the absolute one (default `false`)
     */
    export function moveObject(objectId: tfm.integer, xPosition: tfm.integer, yPosition: tfm.integer, positionOffset?: boolean, xSpeed?: tfm.integer, ySpeed?: tfm.integer, speedOffset?: boolean, angle?: tfm.integer, angleOffset?: boolean): void
    /**
     * Defines the speed and position of a physic object.
     * @param objectId The physic object identifier
     * @param xPosition the horizontal coordinate of the point where the object will be moved
     * @param yPosition the vertical coordinate of the point where the object will be moved
     * @param positionOffset whether the specified position is an offset to apply to the current one, or the absolute one (default `false`)
     * @param xSpeed the horizontal coordinate of the speed to give to the object (default `0`)
     * @param ySpeed the vertical coordinate of the speed to give to the object (default `0`)
     * @param speedOffset whether the specified speed is an offset to apply to the current one, or the absolute one (default `false`)
     * @param angle the angle of the the object (default `0`)
     * @param angleOffset whether the specified angle is an offset to apply to the current one, or the absolute one (default `false`)
     */
    export function movePhysicObject(objectId: tfm.integer, xPosition: tfm.integer, yPosition: tfm.integer, positionOffset?: boolean, xSpeed?: tfm.integer, ySpeed?: tfm.integer, speedOffset?: boolean, angle?: tfm.integer, angleOffset?: boolean): void
    /**
     * Defines the speed and position of a player.
     * @param playerName the player to move
     * @param xPosition the horizontal coordinate of the point where the player will be moved
     * @param yPosition the vertical coordinate of the point where the player will be moved
     * @param positionOffset whether the specified position an offset to apply to the current one, or the absolute one (default `false`)
     * @param xSpeed the horizontal coordinate of the speed to give to the player (default `0`)
     * @param ySpeed the vertical coordinate of the speed to give to the player (default `0`)
     * @param speedOffset whether the specified speed an offset to apply to the current one, or the absolute one (default `false`)
     */
    export function movePlayer(playerName: string, xPosition: tfm.integer, yPosition: tfm.integer, positionOffset?: boolean, xSpeed?: tfm.integer, ySpeed?: tfm.integer, speedOffset?: boolean): void
    /**
     * Starts a new game
     * @param mapCode the map code (default `null`)
     *     - nil (a random map)
     *     - 6 (vanilla map)
     *     - @42583 (editor map)
     *     - #4 (perm category map)
     *     - anything beginning with '<' (xml map)
     * @param flipped whether the map should be flipped (default `nil (randomly mirrored in racing and bootcamp rooms, unless)`)
     */
    export function newGame(mapCode?: string, flipped?: boolean): void
    /**
     * Makes a player do an emote.
     * @param playerName the player who should do the emote
     * @param emoteId the emote to do
     * @param emoteArg the emote attribute (for the flag emote for example) (default `null`)
     */
    export function playEmote(playerName: string, emoteId: tfm.integer, emoteArg?: string): void
    /**
     * Makes a player enter the hole. It only works if the player already has a cheese!
     * @param playerName the player who should win
     */
    export function playerVictory(playerName: string): void
    /**
     * Removes a defilante bonus (token).
     * @param id the identifier of the bonus (default `0`)
     * @param targetPlayer the player whom should have the bonus removed (if nil, applies to all players) (default `null`)
     */
    export function removeBonus(id?: tfm.integer, targetPlayer?: string): void
    /**
     * Takes away the cheese from a player.
     * @param playerName the player who should get their cheese removed
     */
    export function removeCheese(playerName: string): void
    /**
     * Removes an image.
     * @param imageId the image identifier
     */
    export function removeImage(imageId: tfm.integer): void
    /**
     * Removes a joint from the game.
     * @param id the identifier of the joint to remove
     */
    export function removeJoint(id: tfm.integer): void
    /**
     * Removes a shaman object.
     * @param objectId the shaman object identifier
     */
    export function removeObject(objectId: tfm.integer): void
    /**
     * Removes a ground from the game.
     * @param id the identifier of the ground to remove
     */
    export function removePhysicObject(id: tfm.integer): void
    /**
     * Respawns a player.
     * @param playerName the player to respawn
     */
    export function respawnPlayer(playerName: string): void
    /**
     * Enable 'Aie' mode when mice can die when they hit something too hard. Last until the next map.
     * @param enable Enabled or disable 'Aie' mode. (default `true`)
     * @param sensibility Sensibility of the 'Aie' mode. (default `1`)
     * @param targetPlayer Target player (nil for all player in room). (default `null`)
     */
    export function setAieMode(enable?: boolean, sensibility?: number, targetPlayer?: string): void
    /**
     * Sets whether the following maps should be flipped (always, never, or TFM's default behaviour).
     * @param flipped whether the maps should be flipped (default `nil (the default TFM behaviour)`)
     */
    export function setAutoMapFlipMode(flipped?: boolean): void
    /**
     * Sets the game remaining time.
     * @param time the remaining time in seconds
     * @param init whether the remaining time should change even if the specified remaining time is higher than the current one (default `true`)
     */
    export function setGameTime(time: tfm.integer, init?: boolean): void
    /**
     * Changes a player's nickname's color.
     * @param playerName the player whose nickname  should be colored
     * @param color the color of the nickname
     */
    export function setNameColor(playerName: string, color: tfm.integer): void
    /**
     * Set the world gravity and wind scale for a player.
     * @param playerName Targeted player name.
     * @param gravityScale Gravity scale value. (default `1`)
     * @param windScale Wind scale value. (default `1`)
     */
    export function setPlayerGravityScale(playerName: string, gravityScale?: number, windScale?: number): void
    /**
     * Set the night mode for a player.
     * @param nightMode Enable or disable the night mode. (default `true`)
     * @param playerName Targeted player name. If nil affect all player in room. (default `null`)
     */
    export function setPlayerNightMode(nightMode?: boolean, playerName?: string): void
    /**
     * Sets the player's score.
     * @param playerName the player who should get his or her score changed
     * @param score the score
     * @param add whether the current score should be added to the specified one (default `false`)
     */
    export function setPlayerScore(playerName: string, score: tfm.integer, add?: boolean): void
    /**
     * Changes the room's current synchronizer (or resets it).
     *
     * Module team only.
     * @param playerName the player who should become the room sync (use nil to let the server decide)
     */
    export function setPlayerSync(playerName: string): void
    /**
     * Sets the max number of players in a room.
     * @param maxPlayers the maximum number of players the room can hold
     */
    export function setRoomMaxPlayers(maxPlayers: tfm.integer): void
    /**
     * Password-protects a room.
     * @param password the string to set as the password (an empty string removes the protection)
     */
    export function setRoomPassword(password: string): void
    /**
     * Makes a player a shaman.
     * @param playerName the player who should become a shaman
     * @param makeAShaman whether the player should be a shaman (default `true`)
     */
    export function setShaman(playerName: string, makeAShaman?: boolean): void
    /**
     * Changes the shaman mode of a player.
     * @param playerName the player's nickname who will have another shaman mode
     * @param mode the new shaman mode of the target (use nil to use the player's real mode) (default `null`)
     */
    export function setShamanMode(playerName: string, mode?: tfm.integer): void
    /**
     * Makes a player a vampire.
     * @param playerName the player to make a vampire
     * @param makeAVampire whether the player should be a vampire (default `true`)
     */
    export function setVampirePlayer(playerName: string, makeAVampire?: boolean): void
    /**
     * Changes the world acceleration along the horizontal (wind) and vertical (gravity) axes.
     * @param xAcceleration the horizontal acceleration of the world (default `0`)
     * @param yAcceleration the vertical acceleration of the world (default `10`)
     */
    export function setWorldGravity(xAcceleration?: tfm.integer, yAcceleration?: tfm.integer): void
    /**
     * Makes the snow fall.
     * @param duration the snowfall duration in seconds (default `60`)
     * @param snowballPower  (default `10`)
     */
    export function snow(duration?: tfm.integer, snowballPower?: tfm.integer): void
  }
}
declare namespace ui {
  /**
   * Displays a popup.
   * @param id the identifier of the popup
   * @param type the popup type (0 for simple, 1 for yes or no, 2 for player input)
   * @param text the text to display
   * @param targetPlayer the player who will see the popup (if nil, applies to all players) (default `null`)
   * @param x the horizontal coordinate of the top-left corner (default `50`)
   * @param y the vertical coordinate of the top-left corner (default `50`)
   * @param width the width in pixels of the popup (if 0, it will be ajusted to the text width) (default `0`)
   * @param fixedPos whether the position is fixed or if it should follow the player's camera on long maps (default `false`)
   */
  export function addPopup(id: tfm.integer, type: tfm.integer, text: string, targetPlayer?: string, x?: tfm.integer, y?: tfm.integer, width?: tfm.integer, fixedPos?: boolean): void
  /**
   * Displays a text area.
   * @param id the identifier of the text area
   * @param text the text to display
   * @param targetPlayer the player who will see the text area (if nil, applies to all players) (default `null`)
   * @param x the horizontal coordinate of the top-left corner (default `50`)
   * @param y the vertical coordinate of the top-left corner (default `50`)
   * @param width the width in pixels of the text area (if 0, it will be ajusted to the text width) (default `0`)
   * @param height the height in pixels of the text area (if 0, it will be ajusted to the text height) (default `0`)
   * @param backgroundColor the background color of the text area (default `0x324650`)
   * @param borderColor the border color of the text area (default `0`)
   * @param backgroundAlpha the background's opacity, from 0 (transparent) to 1 (opaque) (default `1`)
   * @param fixedPos whether the position is fixed or if it should follow the player's camera on long maps (default `false`)
   */
  export function addTextArea(id: tfm.integer, text: string, targetPlayer?: string, x?: tfm.integer, y?: tfm.integer, width?: tfm.integer, height?: tfm.integer, backgroundColor?: tfm.integer, borderColor?: tfm.integer, backgroundAlpha?: number, fixedPos?: boolean): void
  /**
   * Removes a text area.
   * @param id the identifier of the text area
   * @param targetPlayer the player whom the text area will disappear (if nil, applies to all players) (default `null`)
   */
  export function removeTextArea(id: tfm.integer, targetPlayer?: string): void
  /**
   * Set the background color. Last one game.
   * @param color Background color. (default `"#6A7495"`)
   */
  export function setBackgroundColor(color?: string): void
  /**
   * Sets the map name.
   * @param text the text to display as the map name
   */
  export function setMapName(text: string): void
  /**
   * Sets the shaman name.
   * @param text the text to display as the shaman name
   */
  export function setShamanName(text: string): void
  /**
   * Displays a color picker.
   * @param id the identifier of the color picker
   * @param targetPlayer the player who will see the color picker (if nil, applies to all players) (default `null`)
   * @param defaultColor the default color on the color picker (default `0`)
   * @param title the title of the color picker (default `null`)
   */
  export function showColorPicker(id: tfm.integer, targetPlayer?: string, defaultColor?: tfm.integer, title?: string): void
  /**
   * Updates the content of a text area.
   * @param id the identifier of the text area
   * @param text the new text to display
   * @param targetPlayer the player who will get displayed the new text (if nil, applies to all players) (default `null`)
   */
  export function updateTextArea(id: tfm.integer, text: string, targetPlayer?: string): void
}
