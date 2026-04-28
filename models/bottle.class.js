class Bottle extends movableObject {
  width = 60;
  height = 70;
  offsetTop = 14;
  offsetBottom = 18;
  offsetLeft = 30;
  offsetRight = 18;

  /**
   * @param {number} x - Horizontal position of the bottle on the ground.
   */
  constructor(x) {
    super();
    this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.x = x;
    this.y = 350;
  }
}
