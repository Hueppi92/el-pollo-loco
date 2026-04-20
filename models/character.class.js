class Character extends movableObject {
  hurtTimestamp = 0;
  jumpAllowed = true;
  x = 50;
  y = 145;
  width = 110;
  height = 280;

  /** Tighter collision box – the Pepe sprite has large transparent borders. */
  offsetTop    = 100;
  offsetBottom =  10;
  offsetLeft   =  20;
  offsetRight  =  20;

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
  ];

  IMAGES_SLEEPING = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
IMAGES_JUMPING = [
  "img/2_character_pepe/3_jump/J-31.png",
  "img/2_character_pepe/3_jump/J-32.png",
  "img/2_character_pepe/3_jump/J-33.png",
  "img/2_character_pepe/3_jump/J-34.png",
  "img/2_character_pepe/3_jump/J-35.png",
  "img/2_character_pepe/3_jump/J-36.png",
  "img/2_character_pepe/3_jump/J-37.png",
  "img/2_character_pepe/3_jump/J-38.png",
  "img/2_character_pepe/3_jump/J-39.png",
];

IMAGES_HURT = [
  "img/2_character_pepe/4_hurt/H-41.png",
  "img/2_character_pepe/4_hurt/H-42.png",
  "img/2_character_pepe/4_hurt/H-43.png"
];

IMAGES_DEAD = [
  'img/2_character_pepe/5_dead/D-51.png',
  'img/2_character_pepe/5_dead/D-52.png',
  'img/2_character_pepe/5_dead/D-53.png',
  'img/2_character_pepe/5_dead/D-54.png',
  'img/2_character_pepe/5_dead/D-55.png',
  'img/2_character_pepe/5_dead/D-56.png',
  'img/2_character_pepe/5_dead/D-57.png'
];

SOUNDS_PEPE = [
  "audio/pepe/walking1.mp3",
  "audio/pepe/jump.mp3",
  "audio/pepe/ouch.mp3"
];

walking_sound = new Audio(this.SOUNDS_PEPE[0]);
jumping_sound = new Audio(this.SOUNDS_PEPE[1]);
hurt_sound    = new Audio(this.SOUNDS_PEPE[2]);

  /** @type {World} Reference to the game world, set after the world is constructed. */
  world;
  currentImage = 0;
  /** Timestamp of the last movement input, used to detect long idle periods. */
  lastMoveTime = Date.now();
  /** True once the character has been idle for more than 5 seconds. */
  isIdleLong = false;

  /** Preloads all animation frames and starts the movement and animation loops. */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEPING);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }

  /** Starts the physics movement loop (60 fps) and the animation loop (12.5 fps). */
  animate() {
    this.speed = 5;
    setStoppableInterval(() => this.moveCharacter(), 1000 / 60);
    setStoppableInterval(() => this.playCharacter(), 80);
  }

  /** Reads keyboard input, moves the character, and updates the camera position. */
  moveCharacter() {
    if (!this.world || this.isDead()) return;
    this.walking_sound.playbackRate = 2.5;
    this.walking_sound.pause();
    if (this.canMoveRight()) this.moveRight();
    if (this.canMoveLeft()) this.moveLeft();
    if (this.canJump()) this.jump();
    if (!this.jumpAllowed && !this.isAboveGround()) this.jumpAllowed = true;
    this.updateIdleState();
    const minCameraX = -(this.world.level_end_x - this.world.canvas.width);
    this.world.camera_x = Math.max(minCameraX, Math.min(0, -this.x + 100));
  }

  /**
   * Returns true when the character is allowed to move right.
   * @returns {boolean}
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level_end_x - this.width;
  }

  /** Moves the character right and plays the walking sound when on the ground. */
  moveRight() {
    super.moveRight();
    this.otherDirection = false;
    if (!this.isAboveGround()) this.walking_sound.play();
  }

  /**
   * Returns true when the character is allowed to move left.
   * @returns {boolean}
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  /** Moves the character left and plays the walking sound when on the ground. */
  moveLeft() {
    super.moveLeft();
    this.otherDirection = true;
    if (!this.isAboveGround()) this.walking_sound.play();
  }

  /**
   * Returns true when the character can initiate a jump.
   * @returns {boolean}
   */
  canJump() {
    return this.world.keyboard.UP && this.jumpAllowed && !this.isAboveGround();
  }

  /** Plays the hurt animation and sound and updates the health status bar. */
  handleHurt() {
    this.playAnimation(this.IMAGES_HURT);
    this.hurt_sound.volume = 1;
    this.hurt_sound.currentTime = 0;
    this.hurt_sound.play().catch(() => {});
    this.hurtTimestamp = Date.now();
    this.world.statusbarHealth.setPercentage(this.health);
  }

  /**
   * Returns true if the character was hurt within the last 500 ms.
   * @returns {boolean}
   */
  isHurt() {
    return Date.now() - this.hurtTimestamp < 500;
  }

  /**
   * Returns true if the character's health has reached zero.
   * @returns {boolean}
   */
  isDead() {
    return this.health <= 0;
  }

  /** Tracks whether the character has been idle long enough to trigger the sleeping animation. */
  updateIdleState() {
    const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.isAboveGround();
    if (isMoving) {
      this.lastMoveTime = Date.now();
      this.isIdleLong = false;
    } else if (Date.now() - this.lastMoveTime > 5000) {
      this.isIdleLong = true;
    }
  }

  /** Selects and plays the correct animation frame based on the character's current state. */
  playCharacter() {
    if (!this.world) return;
    if (this.isDead()) { this.playAnimation(this.IMAGES_DEAD); return; }
    if (this.isHurt()) { this.playAnimation(this.IMAGES_HURT); return; }
    if (this.isAboveGround()) { this.playAnimation(this.IMAGES_JUMPING); return; }
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (this.isIdleLong) {
      this.playAnimation(this.IMAGES_SLEEPING);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /** Launches the character upward, plays the jump sound, and locks further jumps until landing. */
  jump() {
    if (this.jumping_sound) {
      this.jumping_sound.currentTime = 0;
      this.jumping_sound.play();
    }
    this.speedY = 15;
    this.acceleration = 0.8;
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
    this.jumpAllowed = false;
  }
}
