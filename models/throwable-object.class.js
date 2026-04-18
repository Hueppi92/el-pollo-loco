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
  groundY = 350;

  constructor(x, y, direction) {
    super();
    this.loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.direction = direction; // 1 = right, -1 = left
    this.throw();
  }

  throw() {
    this.speedY = 15;       // small upward arc
    this.acceleration = 1;  // gentle gravity
    this.speedX = 12;       // horizontal speed per physics tick

    setStoppableInterval(() => {
      if (this.y >= this.groundY) {
        if (!this.isSplashing) this.splash();
      } else {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.x += this.speedX * this.direction;
      }
    }, 1000 / 60);

    this.animationInterval = setStoppableInterval(() => {
      if (this.isSplashing) {
        this.playAnimation(this.IMAGES_SPLASH);
      } else {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 50);
  }

  splash() {
    this.isSplashing = true;
    this.speedY = 0;
    this.acceleration = 0;
    setTimeout(() => {
      this.markedForDeletion = true;
    }, 300);
  }
}
