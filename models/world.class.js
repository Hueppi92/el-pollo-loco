class World {
  character = new Character();
  enemies = level1.enemies;
  clouds = level1.clouds;
  level= level1
  backgroundObjects = level1.backgroundObjects;
  statusbar = new Statusbar();


  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  level_end_x = 2158;
  bg_audio = new Audio("audio/world_sounds/background.mp3");
  endSound = new Audio("audio/world_sounds/showdown.mp3");
  endSoundPlayed = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.draw();
    this.bg_audio.loop = true;
    this.bg_audio.volume = 0.3;
    this.bg_audio.play();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusbar);
    if (!this.endSoundPlayed && this.character.x > this.level_end_x - 800) {
      this.bg_audio.pause();
      this.endSound.play();
      this.endSoundPlayed = true;
    }
    requestAnimationFrame(() => {
      this.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo instanceof Character || mo instanceof Chicken) {
      mo.drawFrame(this.ctx); // For debugging hitboxes
    }
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (
          this.character.isColliding(enemy) &&
          !this.character.isHurt() &&
          !this.character.isDead()
        ) {
          this.character.handleDamage(20);
          this.character.handleHurt();
        }
      });
    }, 100);
  }
}
