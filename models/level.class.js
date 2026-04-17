class Level {
    enemies;
    clouds;
    backgroundObjects;
    character;
    bottles;
    bottleBoxes;
  
constructor(enemies, clouds, backgroundObjects, character, bottles = [], bottleBoxes = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.character = character;
    this.bottles = bottles;
    this.bottleBoxes = bottleBoxes;
    }}
    