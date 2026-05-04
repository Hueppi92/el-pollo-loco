/**
 * Creates and returns a fresh Level 1 instance with all enemies, backgrounds,
 * collectibles and coins in their initial state.
 * Call this before constructing a new World so every restart gets clean data.
 * @returns {Level}
 */
function createLevel1() {
  return new Level(
    [
                new Chicken(320),
                new SmallChicken(430),
                new Chicken(560),
                new SmallChicken(690),
                new Chicken(840),
                new Chicken(1010),
                new SmallChicken(1180),
                new Chicken(1360),
        new Endboss(),
    ],
    [
        new Cloud(),
    ],
    [   new BackgroundObject("img/5_background/layers/air.png", -719),    
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),
        new BackgroundObject("img/5_background/layers/air.png", 0),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObject("img/5_background/layers/air.png", 719),
        new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),
        new BackgroundObject("img/5_background/layers/air.png", 1438),
        new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 1438),
        new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 1438),
        new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 1438),
    ],
    new Character(),
    [
        new Bottle(300),
        new Bottle(600),
        new Bottle(900),
        new Bottle(1200),
        new Bottle(1500),
    ],
    [
        new BottleBox(750),
        new BottleBox(1400),
    ],
    [
        new Coin(200, 280),
        new Coin(350, 220),
        new Coin(500, 280),
        new Coin(700, 200),
        new Coin(850, 260),
        new Coin(1000, 220),
        new Coin(1150, 280),
        new Coin(1300, 200),
    ]
  );
}

/** @type {Level} The active level instance, (re-)created on every game start. */
let level1;