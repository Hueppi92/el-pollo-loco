class Bottle extends movableObject {
  width = 60;
  height = 70;

  constructor(x) {
    super();
    this.loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.x = x;
    this.y = 350;
  }
}
