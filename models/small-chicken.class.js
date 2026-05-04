class SmallChicken extends movableObject {
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = [
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];

  y = 360;
  width = 55;
  height = 65;
  health = 1;
  dead_sound = new Audio('audio/enemy/chicken_dead.mp3');
  deadSoundPlayed = false;

  /**
   * Preloads sprites and initializes the small chicken spawn position.
   * @param {number|null} startX - Optional fixed spawn x position.
   */
  constructor(startX = null) {
    super();
    this.loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = startX ?? (220 + Math.random() * 550);
    this.speed = 0.25 + Math.random() * 0.35;
  }

  /** Returns true if the small chicken has no health remaining. */
  isDead() {
    return this.health <= 0;
  }

  /** Starts movement and animation loops. */
  animate() {
    setStoppableInterval(() => {
      if (movableObject.globalMovementLock) return;
      if (!this.isDead()) this.x -= this.speed;
    }, 1000 / 60);

    setStoppableInterval(() => {
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
