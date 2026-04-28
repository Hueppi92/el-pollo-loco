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
  lungeTimestamp = 0;
  health = 6;
  speed = 4;
  hurtDuration = 500;
  hitBlockDuration = 1300;
  offsetTop = 40;
  offsetBottom = 20;
  offsetLeft = 30;
  offsetRight = 30;
  lungeSpeed = 18;
  lungeDuration = 600;
  attackRange = 500;
  hurt_sound = new Audio('audio/enemy/boss_chicken_hurt.mp3');

  /** Preloads all animation frames and sets the boss's initial position. */
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
    return Date.now() - this.hurtTimestamp < this.hurtDuration;
  }

  /**
   * Returns true while the boss is temporarily invulnerable after a hit.
   * @returns {boolean}
   */
  isHitBlocked() {
    return Date.now() - this.hurtTimestamp < this.hitBlockDuration;
  }

  /**
   * Returns true while the boss is mid-lunge (within {@link lungeDuration} ms of the last lunge).
   * @returns {boolean}
   */
  isLunging() {
    return Date.now() - this.lungeTimestamp < this.lungeDuration;
  }

  /** Starts a lunge charge toward the character. */
  lunge() {
    this.lungeTimestamp = Date.now();
  }

  /**
   * Returns true when the character is within attack range of the boss.
   * @param {Character} character - The player character.
   * @returns {boolean}
   */
  isNearCharacter(character) {
    return Math.abs(this.x - character.x) < this.attackRange;
  }

  /** Starts all three recurring loops: movement/physics, lunge trigger, and sprite animation. */
  animate() {
    this.startMovementLoop();
    this.startLungeLoop();
    this.startAnimationLoop();
  }

  /** Walks toward the character each frame; uses lunge speed during a charge. */
  startMovementLoop() {
    setStoppableInterval(() => {
      if (!this.activated || this.isDead() || this.isCurrentlyHurt() || !this.world) return;
      const charX = this.world.character.x;
      const currentSpeed = this.isLunging() ? this.lungeSpeed : this.speed;
      const shouldMove = this.isLunging() || !this.isNearCharacter(this.world.character);
      if (shouldMove) {
        if (charX < this.x) { this.x -= currentSpeed; this.otherDirection = false; }
        else                { this.x += currentSpeed; this.otherDirection = true; }
      }
    }, 1000 / 60);
  }

  /** Triggers a lunge charge every second when the character is within attack range. */
  startLungeLoop() {
    setStoppableInterval(() => {
      if (!this.activated || this.isDead() || this.isCurrentlyHurt() || this.isLunging()) return;
      if (this.world && this.isNearCharacter(this.world.character)) this.lunge();
    }, 1000);
  }

  /** Updates the boss sprite to match the current state each animation tick. */
  startAnimationLoop() {
    setStoppableInterval(() => {
      if (!this.activated) return;
      if (this.isDead()) { this.playAnimation(this.IMAGES_DEAD); }
      else if (this.isCurrentlyHurt()) { this.playAnimation(this.IMAGES_HURT); }
      else if (this.world && this.isNearCharacter(this.world.character)) { this.playAnimation(this.IMAGES_ATTACK); }
      else { this.playAnimation(this.IMAGES_WALKING); }
    }, 150);
  }
}
