/**
 * A collectible coin that plays a two-frame spin animation in place.
 * Coins are placed by the level and collected on collision with the character.
 * @extends movableObject
 */
class Coin extends movableObject {
  /** @type {number} Render width in pixels. */
  width = 80;
  /** @type {number} Render height in pixels. */
  height = 80;
  offsetTop = 15;
  offsetBottom = 15;
  offsetLeft = 20;
  offsetRight = 20;

  /** @type {string[]} Two-frame animation cycle for the spinning coin. */
  IMAGES = [
    'img/8_coin/coin_1.png',
    'img/8_coin/coin_2.png',
  ];

  /**
   * @param {number}       x - Horizontal position on the level.
   * @param {number|null}  y - Vertical position; defaults to 200 when omitted.
   */
  constructor(x, y) {
    super();
    this.loadImages(this.IMAGES);
    this.loadImage(this.IMAGES[0]);
    this.x = x;
    this.y = y ?? 200;
    this.animate();
  }

  /** Starts the two-frame spin animation on a 300 ms interval. */
  animate() {
    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 300);
  }
}
