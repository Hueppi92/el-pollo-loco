class Coin extends movableObject {
  width = 80;
  height = 80;

  IMAGES = [
    'img/8_coin/coin_1.png',
    'img/8_coin/coin_2.png',
  ];

  constructor(x, y) {
    super();
    this.loadImages(this.IMAGES);
    this.loadImage(this.IMAGES[0]);
    this.x = x;
    this.y = y ?? 200;
    this.animate();
  }

  animate() {
    setStoppableInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 300);
  }
}
