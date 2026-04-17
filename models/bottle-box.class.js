class BottleBox extends movableObject {
  width = 120;
  height = 120;

  constructor(x) {
    super();
    this.loadImage('img/6_salsa_bottle/bottle_box.png');
    this.x = x;
    this.y = 340;
  }
}
