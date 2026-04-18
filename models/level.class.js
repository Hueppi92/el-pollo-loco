class Level {
    enemies;
    clouds;
    backgroundObjects;
    character;
    bottles;
    bottleBoxes;
    coins;
  
constructor(enemies, clouds, backgroundObjects, character, bottles = [], bottleBoxes = [], coins = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.character = character;
    this.bottles = bottles;
    this.bottleBoxes = bottleBoxes;
    this.coins = coins;
    }}
    