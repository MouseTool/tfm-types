declare namespace tfm {
  type integer = number | symbol;
  /**
   * Defines a string in the `x,y` format
   */
  type XYString = string | symbol;

  interface Misc {
    apiVersion: string;
    transformiceVersion: number;
  }

  interface ShamanObject {
    angle: integer;
    baseType: integer;
    colors: string[];
    ghost: boolean;
    id: integer;
    type: integer;
    /**
     * The horizontal speed of the object.
     */
    vx: integer;
    /**
     * The vertical speed of the object.
     */
    vy: integer;
    x: integer;
    y: integer;
  }

  interface Player {
    /**
     * The number of cheeses that the player is carrying. This property is useful in multiple-cheese maps (dodue).
     */
    cheeses: integer;
    /**
     * The legacy community of the player. This exists for backward compatibility, consider using `language` instead.
     */
    community: string;
    gender: integer;
    hasCheese: boolean;
    id: integer;
    /**
     * Deprecated. Use `shamanMode` instead.
     */
    inHardMode: integer;
    isDead: boolean;
    isFacingRight: boolean;
    isInvoking: boolean;
    isJumping: boolean;
    isShaman: boolean;
    isVampire: boolean;
    language: string;
    look: string;
    movingLeft: boolean;
    movingRight: boolean;
    playerName: string;
    registrationDate: integer;
    score: integer;
    shamanMode: integer;
    spouseId: integer;
    spouseName: string;
    title: integer;
    tribeId: integer;
    tribeName: string;
    /**
     * The horizontal speed of the player.
     */
    vx: integer;
    /**
     * The vertical speed of the player.
     */
    vy: integer;
    /**
     * The horizontal coordinate of the player.
     */
    x: integer;
    /**
     * The vertical coordinate of the player.
     */
    y: integer;
  }

  interface XmlMapInfo {
    author: string;
    mapCode: integer;
    permCode: integer;
    xml: string;
  }

  interface Room {
    /**
     * The legacy community of the room. This exists for backward compatibility, consider using `language` instead.
     */
    community: string;
    currentMap: string;
    isTribeHouse: boolean;
    language: string;
    maxPlayers: integer;
    mirroredMap: boolean;
    name: string;
    objectList: Record<integer, tfm.ShamanObject>;
    passwordProtected: boolean;
    playerList: Record<string, tfm.Player>;
    /**
     * The number of unique IP addresses in the room.
     *
     * Module team only.
     */
    uniquePlayers?: integer;
    xmlMapInfo?: tfm.XmlMapInfo;
  }

  enum JointType {
    distance = 0,
    prismatic = 1,
    pulley = 2,
    revolute = 3,
  }

  interface JointDef {
    type: JointType;
    /**
     * location of the ground1 anchor (default: the ground1's center)
     */
    point1: XYString;
    /**
     * location of the ground2 anchor (default: the ground2's center), only used with distance and pulley joints
     */
    point2: XYString;
    /**
     * location of the pulley's first anchor, only used with pulley joints
     */
    point3: XYString;
    /**
     * location of the pulley's second anchor, only used with pulley joints
     */
    point4: XYString;

    /**
     * distance joints' frequency
     */
    frequency: number;
    /**
     * distance joints' damping ratio
     */
    damping: number;
    /**
     * prismatic joints' axis
     */
    axis: XYString;
    /**
     * prismatic joints' angle
     */
    angle: integer;
    /**
     * prismatic and revolute joints' translation/rotation first limit
     */
    limit1: number;
    /**
     * prismatic and revolute joints' translation/rotation second limit
     */
    limit2: number;
    /**
     * prismatic and revolute joints' motor power
     */
    forceMotor: number;
    /**
     * prismatic and revolute joints' motor speed
     */
    speedMotor: number;
    /**
     * revolute joints' ratio
     */
    ratio: number;
    /**
     * draw line's thickness
     */
    line: integer;
    /**
     * draw line's color
     */
    color: integer;
    /**
     * draw line's opacity
     */
    alpha: number;
    /**
     * whether the draw line is foreground
     */
    foreground: boolean;
  }

  interface BodyDef {
    type: integer;
    width: integer;
    height: integer;
    foreground: boolean;
    friction: number;
    restitution: number;
    angle: integer;
    color: integer;
    miceCollision: boolean;
    groundCollision: boolean;
    dynamic: boolean;
    fixedRotation: boolean;
    mass: integer;
    linearDamping: number;
    angularDamping: number;
  }

  interface ShamanObjOpt {
    fixedXSpeed: number;
    fixedYSpeed: number;
  }

  interface NPCDef {
    title: integer;
    look: string;
    /**
     * The horizontal coordinate of the NPC.
     */
    x: integer;
    /**
     * The vertical coordinate of the NPC.
     */
    y: integer;
    /**
     * Whether the title shown is in female gender context.
     */
    female: boolean;
    lookLeft: boolean;
    lookAtPlayer: boolean;
    /**
     * Whether clicking on the NPC is enabled and will trigger `eventTalkToNPC`.
     */
    interactive: boolean;
  }

  /**
   * Describes a player collision with the ground.
   */
  interface ContactDef {
    playerX: integer;
    playerY: integer;
    contactX: integer;
    contactY: integer;
    speedX: number;
    speedY: number;
  }

  namespace get {
    const misc: Misc;
    const room: Room;
  }
}
