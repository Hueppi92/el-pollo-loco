class Chicken extends movableObject {
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

  y = 335; // Ground level for the chicken
  width = 70;
  height = 80;
  health = 1;
  dead_sound = new Audio('audio/enemy/chicken_dead.mp3');
  deadSoundPlayed = false;

  constructor() {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 200 + Math.random() * 500; // Random x position between 400 and 900
    this.speed = 0.15 + Math.random() * 0.3; // Random speed between 0.15 and 0.45
    this.animate();
  }

  isDead() {
    return this.health <= 0;
  }

  animate() {
    setInterval(() => {
      if (!this.isDead()) this.x -= this.speed;
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.deadSoundPlayed) {
          this.dead_sound.play();
          this.deadSoundPlayed = true;
        }
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 150);
  }
}
