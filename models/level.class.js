/**
 * Holds all entities and objects that make up a single game level.
 */
class Level {
    /** @type {movableObject[]} */ enemies;
    /** @type {Cloud[]}         */ clouds;
    /** @type {BackgroundObject[]} */ backgroundObjects;
    /** @type {Character}       */ character;
    /** @type {Bottle[]}        */ bottles;
    /** @type {BottleBox[]}     */ bottleBoxes;
    /** @type {Coin[]}          */ coins;

  /**
   * @param {movableObject[]}    enemies
   * @param {Cloud[]}            clouds
   * @param {BackgroundObject[]} backgroundObjects
   * @param {Character}          character
   * @param {Bottle[]}           [bottles=[]]
   * @param {BottleBox[]}        [bottleBoxes=[]]
   * @param {Coin[]}             [coins=[]]
   */
constructor(enemies, clouds, backgroundObjects, character, bottles = [], bottleBoxes = [], coins = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.character = character;
    this.bottles = bottles;
    this.bottleBoxes = bottleBoxes;
    this.coins = coins;
    }}
    