class Endboss extends movableObject {
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  activated = false;
  hurtTimestamp = 0;
  health = 3;
  speed = 1.5;
  attackRange = 250;
  hurt_sound = new Audio('audio/enemy/boss_chicken_hurt.mp3');

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 1800;
    this.y = 0;
    this.width = 300;
    this.height = 450;
  }

  /**
   * Reduces the boss's health by 1 and starts the hurt cooldown.
   * Has no effect if the boss is already dead.
   */
  takeHit() {
    if (this.isDead()) return;
    this.health--;
    this.hurtTimestamp = Date.now();
    this.hurt_sound.currentTime = 0;
    this.hurt_sound.play();
  }

  /**
   * Returns true if the boss was hit within the last 600 ms (immune window).
   * @returns {boolean}
   */
  isCurrentlyHurt() {
    return Date.now() - this.hurtTimestamp < 600;
  }

  /**
   * Returns true when the character is within attack range of the boss.
   * @param {Character} character - The player character.
   * @returns {boolean}
   */
  isNearCharacter(character) {
    return Math.abs(this.x - character.x) < this.attackRange;
  }

  animate() {
    // Movement — walk toward character once activated
    setStoppableInterval(() => {
      if (!this.activated || this.isDead() || this.isCurrentlyHurt()) return;
      if (this.world && !this.isNearCharacter(this.world.character)) {
        if (this.world.character.x < this.x) {
          this.x -= this.speed;
          this.otherDirection = false;
        } else {
          this.x += this.speed;
          this.otherDirection = true;
        }
      }
    }, 1000 / 60);

    // Animation state
    setStoppableInterval(() => {
      if (!this.activated) return;
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isCurrentlyHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else if (this.world && this.isNearCharacter(this.world.character)) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 150);
  }
}
