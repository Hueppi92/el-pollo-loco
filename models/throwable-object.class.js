/**
 * A salsa bottle thrown by the character. Follows a small parabolic arc, then
 * plays a splash animation on hitting the ground or an enemy.
 * @extends movableObject
 */
class ThrowableObject extends movableObject {
  IMAGES_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  IMAGES_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  width = 60;
  height = 60;
  isSplashing = false;
  soundTriggered = false;
  groundY = 350;
  breakSound = (() => { const a = new Audio('audio/world_sounds/bottle_break.mp3'); a.load(); return a; })();

  offsetTop    = 10;
  offsetBottom = 10;
  offsetLeft   = 10;
  offsetRight  = 10;

  /**
   * @param {number} x         - Initial horizontal position.
   * @param {number} y         - Initial vertical position.
   * @param {number} direction - Throw direction: 1 = right, -1 = left.
   */
  constructor(x, y, direction) {
    super();
    this.loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.throw();
  }

  /** Initialises throw physics and starts both the physics and animation loops. */
  throw() {
    this.speedY = 15;
    this.acceleration = 1;
    this.speedX = 12;
    this.startPhysicsLoop();
    this.startAnimationLoop();
  }

  /** Moves the bottle along its parabolic trajectory each physics tick. */
  startPhysicsLoop() {
    setStoppableInterval(() => {
      if (this.y >= this.groundY) {
        if (!this.isSplashing) this.splash();
      } else {
        this.tickPhysics();
      }
    }, 1000 / 60);
  }

  /** Advances position and speed by one tick; plays break sound when near ground. */
  tickPhysics() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
    this.x += this.speedX * this.direction;
    if (this.y >= this.groundY - 30 && !this.soundTriggered) {
      this.soundTriggered = true;
      this.breakSound.currentTime = 0;
      this.breakSound.play().catch(() => {});
    }
  }

  /** Cycles through the appropriate animation frames each animation tick. */
  startAnimationLoop() {
    setStoppableInterval(() => {
      if (this.isSplashing) {
        this.playAnimation(this.IMAGES_SPLASH);
      } else {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 50);
  }

  /** Triggers the splash animation, plays the break sound, and schedules removal of the bottle from the world. */
  splash() {
    this.isSplashing = true;
    this.speedY = 0;
    this.acceleration = 0;
    if (!this.soundTriggered) {
      this.soundTriggered = true;
      this.breakSound.currentTime = 0;
      this.breakSound.play().catch(() => {});
    }
    setTimeout(() => { this.markedForDeletion = true; }, 300);
  }
}
