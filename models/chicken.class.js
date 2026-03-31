class Chicken extends movableObject {
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  y = 340; // Ground level for the chicken
  width = 70;
  height = 80;

  constructor() {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random() * 500; // Random x position between 400 and 900
    this.speed = 0.15 + Math.random() * 0.3; // Random speed between 0.15 and 0.45
    this.animate();
  }

  animate() {
    this.moveLeft();

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }
}
