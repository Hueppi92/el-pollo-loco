class World {
  character = new Character();
  enemies = level1.enemies;
  clouds = level1.clouds;
  level= level1
  backgroundObjects = level1.backgroundObjects;

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
    // Preload health bar images
    this.healthBarImages = {
      green: new Image(),
      orange: new Image(),
      blue: new Image()
    };
    this.healthBarImages.green.src = 'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png';
    this.healthBarImages.orange.src = 'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png';
    this.healthBarImages.blue.src = 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png';
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

    // If character is dead, show game over and stop loop
    if (this.character.health <= 0) {
      // Stop all sounds
      if (this.bg_audio && !this.bg_audio.paused) this.bg_audio.pause();
      if (this.endSound && !this.endSound.paused) this.endSound.pause();
      const gameOverImg = new Image();
      gameOverImg.src = 'img/9_intro_outro_screens/game_over/game over.png';
      gameOverImg.onload = () => {
        this.ctx.drawImage(gameOverImg, 0, 0, this.canvas.width, this.canvas.height);
      };
      return;
    }

    // Draw health bar for Pepe
    let health = Math.max(0, Math.min(100, this.character.health));
    let barImg;
    if (health > 66) {
      barImg = this.healthBarImages.green;
    } else if (health > 33) {
      barImg = this.healthBarImages.orange;
    } else {
      barImg = this.healthBarImages.blue;
    }
    // Only draw if image is loaded
    if (barImg.complete && barImg.naturalWidth > 0) {
      this.ctx.drawImage(barImg, 20, 20, 200 * (health / 100), 40);
    }

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addToMap(this.character);
    this.addObjectsToMap(this.enemies);

    this.ctx.translate(-this.camera_x, 0);

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
    mo.drawFrame(this.ctx); // For debugging hitboxes
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
        if (this.character.isColliding(enemy)) {
          if (!this.character.isHurt()) {
            this.character.health -= 5;
            console.log("Character health:", this.character.health);
            this.character.handleHurt();
          }
        }
      });
    }, 100);
  }
}
