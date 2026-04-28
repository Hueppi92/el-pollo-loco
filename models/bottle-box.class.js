class BottleBox extends movableObject {
  width = 120;
  height = 120;

  /**
   * @param {number} x - Horizontal position of the crate in the level.
   */
  constructor(x) {
    super();
    this.loadImage('img/6_salsa_bottle/bottle_box.png');
    this.x = x;
    this.y = 340;
  }
}
