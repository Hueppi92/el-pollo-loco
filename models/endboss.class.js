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
  lungeCooldownTimestamp = 0;
  maxHealth = 6;
  health = 6;
  speed = 2.4;
  hurtDuration = 500;
  hitBlockDuration = 1300;
  offsetTop = 40;
  offsetBottom = 20;
  offsetLeft = 30;
  offsetRight = 30;
  lungeSpeed = 11;
  lungeDuration = 450;
  lungeCooldown = 1600;
  attackRange = 420;
  keepDistance = 130;
  isVisible = false;
  hurt_sound = new Audio('audio/enemy/boss_chicken_hurt.mp3');

  /** Preloads all animation frames and sets the boss's initial position. */
  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2600;
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

  /** Returns the current health as a status-bar percentage (0-100). */
  getHealthPercentage() {
    return (this.health / this.maxHealth) * 100;
  }

  /** Starts all three recurring loops: movement/physics, lunge trigger, and sprite animation. */
  animate() {
    this.startMovementLoop();
    this.startLungeLoop();
    this.startAnimationLoop();
  }

  /** Returns whether the movement loop should skip this frame. */
  shouldSkipMovementLoop() {
    return movableObject.globalMovementLock || !this.activated || this.isDead() || this.isCurrentlyHurt() || !this.world;
  }

  /** Collects the current movement state relative to the character. */
  getMovementState() {
    const charX = this.world.character.x;
    const distance = Math.abs(charX - this.x);
    const currentSpeed = this.isLunging() ? this.lungeSpeed : this.speed;
    const shouldRetreat = !this.isLunging() && distance < this.keepDistance;
    const shouldMove = this.isLunging() || shouldRetreat || !this.isNearCharacter(this.world.character);
    return { charX, currentSpeed, shouldRetreat, shouldMove };
  }

  /** Moves the boss according to the current character position. */
  moveByState({ charX, currentSpeed, shouldRetreat }) {
    if (shouldRetreat) {
      this.x += charX < this.x ? currentSpeed : -currentSpeed;
      this.otherDirection = charX > this.x;
      return;
    }
    this.x += charX < this.x ? -currentSpeed : currentSpeed;
    this.otherDirection = charX >= this.x;
  }

  /** Walks toward the character each frame; uses lunge speed during a charge. */
  startMovementLoop() {
    setStoppableInterval(() => {
      if (this.shouldSkipMovementLoop()) return;
      const movementState = this.getMovementState();
      if (!movementState.shouldMove) return;
      this.moveByState(movementState);
    }, 1000 / 60);
  }

  /** Triggers a lunge charge every second when the character is within attack range. */
  startLungeLoop() {
    setStoppableInterval(() => {
      if (movableObject.globalMovementLock || !this.activated || this.isDead() || this.isCurrentlyHurt() || this.isLunging()) return;
      if (Date.now() - this.lungeCooldownTimestamp < this.lungeCooldown) return;
      if (this.world && this.isNearCharacter(this.world.character)) {
        this.lungeCooldownTimestamp = Date.now();
        this.lunge();
      }
    }, 200);
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
