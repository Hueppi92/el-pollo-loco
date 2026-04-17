class Character extends movableObject {
  hurtTimestamp = 0;
  canJump = true;
  x = 50;
  y = 145;
  width = 110;
  height = 280;

  IMAGES_IDLE = [
    "/img/2_character_pepe/1_idle/idle/I-1.png",
    "/img/2_character_pepe/1_idle/idle/I-2.png",
    "/img/2_character_pepe/1_idle/idle/I-3.png",
    "/img/2_character_pepe/1_idle/idle/I-4.png",
    "/img/2_character_pepe/1_idle/idle/I-5.png",
    "/img/2_character_pepe/1_idle/idle/I-6.png",
    "/img/2_character_pepe/1_idle/idle/I-7.png",
    "/img/2_character_pepe/1_idle/idle/I-8.png",
  ];
  IMAGES_WALKING = [
    "/img/2_character_pepe/2_walk/W-21.png",
    "/img/2_character_pepe/2_walk/W-22.png",
    "/img/2_character_pepe/2_walk/W-23.png",
    "/img/2_character_pepe/2_walk/W-24.png",
    "/img/2_character_pepe/2_walk/W-25.png",
    "/img/2_character_pepe/2_walk/W-26.png",
  ];
IMAGES_JUMPING = [
  "/img/2_character_pepe/3_jump/J-31.png",
  "/img/2_character_pepe/3_jump/J-32.png",
  "/img/2_character_pepe/3_jump/J-33.png",
  "/img/2_character_pepe/3_jump/J-34.png",
  "/img/2_character_pepe/3_jump/J-35.png",
  "/img/2_character_pepe/3_jump/J-36.png",
  "/img/2_character_pepe/3_jump/J-37.png",
  "/img/2_character_pepe/3_jump/J-38.png",
  "/img/2_character_pepe/3_jump/J-39.png",
];

IMAGES_HURT = [
  "/img/2_character_pepe/4_hurt/H-41.png",
  "/img/2_character_pepe/4_hurt/H-42.png",
  "/img/2_character_pepe/4_hurt/H-43.png"
];

IMAGES_DEAD = [
  '/img/2_character_pepe/5_dead/D-51.png',
  '/img/2_character_pepe/5_dead/D-52.png',
  '/img/2_character_pepe/5_dead/D-53.png',
  '/img/2_character_pepe/5_dead/D-54.png',
  '/img/2_character_pepe/5_dead/D-55.png',
  '/img/2_character_pepe/5_dead/D-56.png',
  '/img/2_character_pepe/5_dead/D-57.png'
];

SOUNDS_PEPE = [
  "/audio/pepe/walking1.mp3",
  "/audio/pepe/jump.mp3",
  "/audio/pepe/ouch.mp3"
];

walking_sound = new Audio(this.SOUNDS_PEPE[0]);
jumping_sound = new Audio(this.SOUNDS_PEPE[1]);
hurt_sound = new Audio(this.SOUNDS_PEPE[2]);

  world;
  currentImage = 0;
  lastMoveTime = Date.now(); // Timestamp of last movement
  isIdleLong = false; // True if idle for more than 10s

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }
  animate() {
    this.speed = 5;
    setInterval(() => this.updateCharacter(), 1000 / 60);
    setInterval(() => this.updateAnimation(), 80);
  }

  updateCharacter() {
    if (!this.world) return;
    if (this.health <= 0) {
      if (this.walking_sound && !this.walking_sound.paused) this.walking_sound.pause();
      if (this.jumping_sound && !this.jumping_sound.paused) this.jumping_sound.pause();
      if (this.hurt_sound && !this.hurt_sound.paused) this.hurt_sound.pause();
      return;
    }
    let isWalking = this.handleMovement();
    this.handleWalkingSound(isWalking);
    this.handleJump();
    this.handleJumpReset();
    this.updateIdleState(isWalking);
    this.updateCamera();
  }

  handleMovement() {
    let moved = false;
    if (this.world.keyboard.RIGHT && this.x < this.world.level_end_x - this.width) {
      this.otherDirection = false;
      this.x += this.speed;
      moved = true;
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.otherDirection = true;
      this.x -= this.speed;
      moved = true;
    }
    return moved;
  }

  handleWalkingSound(isWalking) {
    if (isWalking) {
      if (this.walking_sound.paused) {
        this.walking_sound.loop = true;
        this.walking_sound.play();
      }
    } else {
      this.walking_sound.pause();
      this.walking_sound.currentTime = 0;
    }
  }

  handleJump() {
    if (this.world.keyboard.UP && this.canJump && !this.isAboveGround()) {
      this.jump();
    }
  }

  handleJumpReset() {
    if (!this.canJump && !this.isAboveGround()) {
      this.canJump = true;
    }
  }

  handleHurt() {
    if(this.health <=0 ) {
      this.isDead();
    }
    this.playAnimation(this.IMAGES_HURT);
    this.hurt_sound.currentTime = 0;
    this.hurt_sound.play();
    this.hurtTimestamp = Date.now();
    this.world.statusbarHealth.setPercentage(this.health);
  }


  isHurt() {
    return Date.now() - this.hurtTimestamp < 500;
  }

isDead() {
   
      return this.health <= 0;
    } 

  updateIdleState(isWalking) {
    if (isWalking || this.isAboveGround()) {
      this.lastMoveTime = Date.now();
      this.isIdleLong = false;
    } else if (Date.now() - this.lastMoveTime > 3000) {
      this.isIdleLong = true;
    }
  }



  updateCamera() {
    const followOffset = 100;
    const minCameraX = -(this.world.level_end_x - this.world.canvas.width);
    const targetCameraX = -this.x + followOffset;
    this.world.camera_x = Math.max(minCameraX, Math.min(0, targetCameraX));
  }

  updateAnimation() {
    if (!this.world) return;
    if (this.health <= 0) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }
    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      if (this.isIdleLong) {
        if (!this._lastIdleFrame || Date.now() - this._lastIdleFrame > 400) {
          this.playAnimation(this.IMAGES_IDLE);
          this._lastIdleFrame = Date.now();
        }
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }
  }
  jump() {
    // Play jumping sound
    if (this.jumping_sound) {
      this.jumping_sound.currentTime = 0;
      this.jumping_sound.play();
    }
    this.speedY = 15;
    this.acceleration = 0.8;
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
    this.canJump = false;
    this.moved = true;
  }
}
