class World {
  static HEALTH_IMAGES = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
  ];

  static COIN_IMAGES = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
  ];

  static BOTTLE_IMAGES = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
  ];

  static ENDBOSS_IMAGES = [
    'img/7_statusbars/2_statusbar_endboss/green/green0.png',
    'img/7_statusbars/2_statusbar_endboss/green/green20.png',
    'img/7_statusbars/2_statusbar_endboss/green/green40.png',
    'img/7_statusbars/2_statusbar_endboss/green/green60.png',
    'img/7_statusbars/2_statusbar_endboss/green/green80.png',
    'img/7_statusbars/2_statusbar_endboss/green/green100.png',
  ];

  character = new Character();
  enemies = level1.enemies;
  clouds = level1.clouds;
  level= level1
  backgroundObjects = level1.backgroundObjects;

  statusbarHealth;
  statusbarCoin;
  statusbarBottle;
  statusbarEndboss;

  throwableObjects = [];
  pendingBottleRespawns = [];
  collectedBottles = 0;
  maxBottles = 5;
  collectedCoins = 0;
  maxCoins = 8;
  canThrow = true;
  bottleRespawnDelay = 8000;

  enemyDamage = 5;
  endbossDamage = 6;
  characterDamage = 5;
  endbossDamageCooldown = 1200;
  lastEndbossDamageTimestamp = 0;

  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  level_end_x = 2158;
  bg_audio = new Audio("audio/world_sounds/background.mp3");
  endSound = new Audio("audio/world_sounds/showdown.mp3");
  winSound = new Audio("audio/world_sounds/winning.mp3");
  loseSound = new Audio("audio/world_sounds/lost.mp3");
  coinSound = new Audio("audio/world_sounds/coin_collect.mp3");
  endSoundPlayed = false;
  movementLocked = false;
  gameEnded = false;
  bossIntroTriggerX = 1500;
  bossIntroStartAlignDuration = 320;
  bossIntroPanDuration = 850;
  bossIntroPanSpeedFactor = 1.45;
  bossIntroRightPadding = 55;
  bossIntroLeftPadding = 45;
  bossEntranceDuration = 1300;
  bossEntranceSpawnOffset = 260;
  bossEntranceDistanceToPepe = 360;
  bossFightStartDelay = 2000;

  /**
   * @param {HTMLCanvasElement} canvas   - The game canvas element.
   * @param {Keyboard}          keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.endboss = this.level.enemies.find(e => e instanceof Endboss);
    this.initStatusbars();
    this.setWorld();
    this.level.enemies.forEach(e => e.animate());
    this.draw();
    this.initAudio();
    this.startIntervals();
  }

  /** Creates the three HUD status bars with their respective image sets and positions. */
  initStatusbars() {
    this.statusbarHealth = new Statusbar(World.HEALTH_IMAGES, 20, 10, 100);
    this.statusbarCoin   = new Statusbar(World.COIN_IMAGES,   20, 68, 0);
    this.statusbarBottle = new Statusbar(World.BOTTLE_IMAGES, 20, 126, 0);
    this.statusbarEndboss = new Statusbar(World.ENDBOSS_IMAGES, this.canvas.width - 220, 10, 100);
  }

  /** Returns whether movement and combat are currently locked for the intro cinematic. */
  isMovementLocked() {
    return this.movementLocked;
  }

  /** Locks or unlocks movement globally for all movable entities. */
  lockMovement(locked) {
    this.movementLocked = locked;
    movableObject.globalMovementLock = locked;
    this.keyboard.lockInputs(locked);
    if (locked) this.character.updateWalkingSound(false);
  }

  /** Returns true once Pepe reaches the fixed x-position that starts the boss intro. */
  isCharacterAtBossTrigger() {
    return this.character.x >= this.getBossIntroTriggerX();
  }

  /** Returns the maximum trigger x so intro starts no later than the first x of the last screen. */
  getBossIntroTriggerX() {
    const lastScreenStartX = Math.max(0, this.level_end_x - this.canvas.width);
    return Math.min(this.bossIntroTriggerX, lastScreenStartX);
  }

  /** Returns the hard right boundary Pepe is not allowed to cross. */
  getCharacterRightBoundaryX() {
    return Math.min(this.level_end_x - this.character.width, this.getBossIntroTriggerX());
  }

  /** Returns whether intro conditions are met and Pepe is grounded. */
  canActivateEndboss() {
    return !this.endSoundPlayed && !this.character.isAboveGround() && this.isCharacterAtBossTrigger();
  }

  /** Assigns the world reference to the character and endboss. */
  setWorld() {
    this.character.world = this;
    if (this.endboss) this.endboss.world = this;
  }

  /** Starts and configures the background audio. */
  initAudio() {
    this.bg_audio.loop = true;
    this.bg_audio.volume = 0.3;
    this.bg_audio.play().catch(() => {});
  }

  /**
   * Mutes or unmutes every audio object in the game world, including character sounds.
   * @param {boolean} muted - Whether to mute all sounds.
   */
  muteAllSounds(muted) {
    const sounds = [
      this.bg_audio, this.endSound, this.winSound,
      this.loseSound, this.coinSound,
      this.character.walking_sound, this.character.jumping_sound, this.character.hurt_sound,
    ];
    sounds.forEach(s => s.muted = muted);
    this.level.enemies.forEach(e => {
      if (e.hurt_sound) e.hurt_sound.muted = muted;
      if (e.dead_sound) e.dead_sound.muted = muted;
    });
    this.throwableObjects.forEach(b => { b.breakSound.muted = muted; });
  }

  /** Registers all recurring collision and game-logic intervals. */
  startIntervals() {
    this.checkCollisions();
    this.checkBottleCollect();
    this.checkBottleRespawn();
    this.checkBottleBoxCollect();
    this.checkBottleHitEnemy();
    this.checkThrow();
    this.checkCoinCollect();
    this.checkGameOver();
  }

  /** Main render loop – clears the canvas, draws all game objects and the HUD, then reschedules itself. */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.drawWorldObjects();
    this.ctx.translate(-this.camera_x, 0);
    this.drawHUD();
    this.checkEndbossActivation();
     this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.ctx.translate(-this.camera_x, 0);
    this._rafId = requestAnimationFrame(() => this.draw());
  }

  /** Draws all scrolling game-world objects (background, characters, items). */
  drawWorldObjects() {
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.bottleBoxes);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.getRenderableEnemies());
    this.addObjectsToMap(this.throwableObjects);
    this.drawEndbossBar();
    
  }

  /** Returns enemies that should currently be drawn (boss stays hidden until intro starts). */
  getRenderableEnemies() {
    return this.enemies.filter((enemy) => !(enemy instanceof Endboss) || enemy.isVisible);
  }

  /** Draws the fixed HUD status bars on top of the world. */
  drawHUD() {
    this.addToMap(this.statusbarHealth);
    this.addToMap(this.statusbarCoin);
    this.addToMap(this.statusbarBottle);
  }

  /** Draws the boss health bar attached to the boss sprite instead of the fixed HUD. */
  drawEndbossBar() {
    if (!this.endboss || !this.endboss.activated || this.endboss.isDead()) return;

    this.statusbarEndboss.x = this.endboss.x + (this.endboss.width - this.statusbarEndboss.width) / 2;
    this.statusbarEndboss.y = this.endboss.y + 25;
    this.statusbarEndboss.setPercentage(this.endboss.getHealthPercentage());
    this.addToMap(this.statusbarEndboss);
  }

  /** Starts the endboss intro state and freezes the regular gameplay loops. */
  prepareEndbossActivation() {
    this.endSoundPlayed = true;
    this.lockMovement(true);
    if (this.endboss) this.endboss.activated = false;
    this.bg_audio.pause();
    this.endSound.currentTime = 0;
    this.endSound.volume = 1;
    this.endSound.playbackRate = 1.0;
  }

  /** Returns the minimum allowed camera x-value at the level end. */
  getMinCameraX() {
    return -(this.level_end_x - this.canvas.width);
  }

  /** Clamps a camera x-value to the valid horizontal level bounds. */
  clampCameraX(cameraX) {
    return Math.max(this.getMinCameraX(), Math.min(0, cameraX));
  }

  /** Returns the camera target where Pepe appears close to the left edge. */
  getBossIntroCameraTarget() {
    return this.clampCameraX(-(this.character.x - this.bossIntroLeftPadding));
  }

  /** Returns the camera target where Pepe appears close to the right edge. */
  getBossIntroRightCameraTarget() {
    const rightScreenX = this.canvas.width - this.character.width - this.bossIntroRightPadding;
    return this.clampCameraX(-(this.character.x - rightScreenX));
  }

  /** Smoothly aligns the camera so Pepe starts near the right edge before the leftward pan begins. */
  alignCameraForBossIntroStart() {
    return this.animateCameraTo(this.getBossIntroRightCameraTarget(), this.bossIntroStartAlignDuration);
  }

  /** Smoothly animates camera_x to a target value over the given duration. */
  animateCameraTo(targetCameraX, duration) {
    const startCameraX = this.camera_x;
    const deltaCamera = targetCameraX - startCameraX;

    if (Math.abs(deltaCamera) < 1 || duration <= 0) {
      this.camera_x = targetCameraX;
      this.character.otherDirection = false;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        this.camera_x = startCameraX + deltaCamera * easedProgress;
        if (progress < 1) {
          requestAnimationFrame(step);
          return;
        }
        this.camera_x = targetCameraX;
        this.character.otherDirection = false;
        resolve();
      };
      requestAnimationFrame(step);
    });
  }

  /** Smoothly pans the camera to the left while Pepe stays frozen in place. */
  runBossIntroCameraPan() {
    const targetCameraX = this.getBossIntroCameraTarget();
    const effectiveDuration = this.bossIntroPanDuration / this.bossIntroPanSpeedFactor;
    return this.animateCameraTo(targetCameraX, effectiveDuration);
  }

  /** Resolves after a fixed delay used to stage cinematic beats. */
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Calculates boss spawn/target x values for the intro walk-in. */
  getBossEntranceTargets() {
    if (!this.endboss) return { startX: 0, targetX: 0 };
    const viewportRight = -this.camera_x + this.canvas.width;
    const startX = Math.max(this.endboss.x, viewportRight + this.bossEntranceSpawnOffset);
    const safeDistance = Math.max(this.bossEntranceDistanceToPepe, this.endboss.attackRange + 90);
    const desiredTargetX = this.character.x + safeDistance;
    const maxBossX = this.level_end_x - this.endboss.width;
    const targetX = Math.max(0, Math.min(maxBossX, desiredTargetX));
    return { startX, targetX };
  }

  /** Plays a scripted boss walk-in from the right edge while gameplay is frozen. */
  runBossEntrance() {
    if (!this.endboss) return Promise.resolve();

    const { startX, targetX } = this.getBossEntranceTargets();
    const deltaX = targetX - startX;
    this.endboss.isVisible = true;
    this.endboss.x = startX;
    this.endboss.otherDirection = false;

    if (Math.abs(deltaX) < 1) {
      this.endboss.x = targetX;
      this.endboss.otherDirection = false;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startTime = performance.now();
      let lastFrameChange = 0;

      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / this.bossEntranceDuration);
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        this.endboss.x = startX + deltaX * easedProgress;
        this.endboss.otherDirection = false;

        if (now - lastFrameChange >= 110) {
          this.endboss.playAnimation(this.endboss.IMAGES_WALKING);
          lastFrameChange = now;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
          return;
        }

        this.endboss.x = targetX;
        this.endboss.otherDirection = false;
        resolve();
      };

      requestAnimationFrame(step);
    });
  }

  /** Unlocks movement, activates the boss, and resumes battle music. */
  finishEndbossActivation() {
    this.endSound.pause();
    this.endSound.currentTime = 0;
    this.lockMovement(false);
    if (this.endboss) this.endboss.activated = true;
    this.bg_audio.playbackRate = 1.4;
    this.bg_audio.play().catch(() => {});
  }

  /** Starts the cinematic showdown sound while camera-pan and boss entrance play. */
  playEndbossIntroSound() {
    this.endSound.play().catch(() => {});
  }

  /** Runs the full intro sequence: freeze, camera pan, boss walk-in, then fight start. */
  startEndbossIntroSequence() {
    this.prepareEndbossActivation();
    this.alignCameraForBossIntroStart()
      .then(() => this.runBossIntroCameraPan())
      .then(() => {
        this.playEndbossIntroSound();
        return this.runBossEntrance();
      })
      .then(() => this.wait(this.bossFightStartDelay))
      .then(() => this.finishEndbossActivation());
  }

  /**
   * Triggers the endboss encounter audio and activates the endboss
   * when the character is close enough to the end of the level.
   */
  checkEndbossActivation() {
    if (!this.canActivateEndboss()) return;
    this.startEndbossIntroSequence();
  }

  /**
   * Draws every object in the given array onto the canvas.
   * @param {DrawableObject[]} objects - Array of game objects to render.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Draws a single object, flipping the canvas horizontally when the object faces left.
   * @param {DrawableObject} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips the canvas context horizontally so a left-facing sprite renders correctly.
   * @param {DrawableObject} mo - The object about to be drawn mirrored.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the canvas context after a horizontal flip.
   * @param {DrawableObject} mo - The object that was drawn mirrored.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /** Periodically tests character-vs-enemy collisions and dispatches the appropriate handler. */
  checkCollisions() {
    setStoppableInterval(() => {
      if (this.isMovementLocked() || this.character.isDead()) return;
      const collidingEnemies = this.level.enemies.filter(
        (enemy) => !enemy.isDead() && this.character.isColliding(enemy)
      );
      if (!collidingEnemies.length) return;
      const stompedEnemies = collidingEnemies.filter((enemy) => this.character.isFallingOnTop(enemy));
      stompedEnemies.length
        ? stompedEnemies.forEach((enemy) => this.handleEnemyCollision(enemy, true))
        : this.handleDamageToCharacter();
    }, 1000 / 60);
  }

  /**
   * Decides whether the character lands on top of an enemy or takes damage.
   * @param {movableObject} enemy - The enemy the character collided with.
   */
  handleEnemyCollision(enemy, isStomp = this.character.isFallingOnTop(enemy)) {
    if (isStomp) {
      if (enemy instanceof Endboss) {
        this.character.speedY = 15;
      } else {
        this.handleDamageToEnemy(enemy);
      }
    } else if (enemy instanceof Endboss) {
      this.handleEndbossContactDamage(enemy);
    } else {
      this.handleDamageToCharacter();
    }
  }

  /** Applies less frequent contact damage from the endboss to avoid unavoidable "stick" hits. */
  handleEndbossContactDamage(enemy) {
    if (Date.now() - this.lastEndbossDamageTimestamp < this.endbossDamageCooldown) return;
    this.lastEndbossDamageTimestamp = Date.now();
    this.handleDamageToCharacter(this.endbossDamage);
    const push = this.character.x < enemy.x ? -45 : 45;
    this.character.x = Math.max(0, Math.min(this.getCharacterRightBoundaryX(), this.character.x + push));
    this.character.speedY = 8;
  }

  /**
   * Kills an enemy by stomping and bounces the character upward.
   * @param {movableObject} enemy - The enemy being stomped.
   */
  handleDamageToEnemy(enemy) {
    enemy.health = 0;
    this.character.speedY = 15;
    setTimeout(() => {
      const i = this.level.enemies.indexOf(enemy);
      if (i !== -1) this.level.enemies.splice(i, 1);
    }, 500);
  }

  /** Deals one hit of enemy damage to the character if the hurt cooldown has expired. */
  handleDamageToCharacter(damage = this.enemyDamage) {
    if (!this.character.isHurt()) {
      this.character.handleDamage(damage);
      this.character.handleHurt();
    }
  }

  /** Periodically checks whether the character walks over a ground bottle and collects it. */
  checkBottleCollect() {
    setStoppableInterval(() => {
      this.level.bottles = this.level.bottles.filter(bottle => {
        if (this.character.isColliding(bottle) && this.collectedBottles < this.maxBottles) {
          this.collectedBottles++;
          this.statusbarBottle.setPercentage(this.collectedBottles * 20);
          this.queueBottleRespawn(bottle);
          return false;
        }
        return true;
      });
    }, 100);
  }

  /** Stores a collected bottle so it can respawn at the same position later. */
  queueBottleRespawn(bottle) {
    this.pendingBottleRespawns.push({
      x: bottle.x,
      respawnAt: Date.now() + this.bottleRespawnDelay,
    });
  }

  /** Periodically restores collected ground bottles after the respawn delay expires. */
  checkBottleRespawn() {
    setStoppableInterval(() => {
      const now = Date.now();
      this.pendingBottleRespawns = this.pendingBottleRespawns.filter((respawn) => {
        if (respawn.respawnAt > now) return true;
        this.level.bottles.push(new Bottle(respawn.x));
        return false;
      });
    }, 200);
  }

  /** Periodically checks whether the character walks over a bottle box and collects it. */
  checkBottleBoxCollect() {
    setStoppableInterval(() => {
      this.level.bottleBoxes = this.level.bottleBoxes.filter(box => {
        if (this.character.isColliding(box) && this.collectedBottles < this.maxBottles) {
          this.collectedBottles = this.maxBottles;
          this.statusbarBottle.setPercentage(100);
          return false;
        }
        return true;
      });
    }, 100);
  }

  /** Periodically checks every thrown bottle against every living enemy for collisions. */
  checkBottleHitEnemy() {
    setStoppableInterval(() => {
      this.throwableObjects.forEach(bottle => {
        if (bottle.markedForDeletion) return;
        this.level.enemies.forEach(enemy => this.handleBottleEnemyCollision(bottle, enemy));
      });
    }, 100);
  }

  /**
   * Applies the correct hit logic when a bottle collides with an enemy.
   * @param {ThrowableObject} bottle - The thrown bottle.
   * @param {movableObject}   enemy  - The enemy being hit.
   */
  handleBottleEnemyCollision(bottle, enemy) {
    if (enemy.isDead() || !bottle.isColliding(enemy)) return;
    if (enemy instanceof Endboss) {
      if (!enemy.activated) return;
      this.handleBottleHitEndboss(bottle, enemy);
    } else {
      enemy.health = 0;
      bottle.splash();
      setTimeout(() => {
        const i = this.level.enemies.indexOf(enemy);
        if (i !== -1) this.level.enemies.splice(i, 1);
      }, 500);
    }
  }

  /**
   * Handles a bottle hitting the endboss: deals damage and removes the boss on death.
   * @param {ThrowableObject} bottle - The thrown bottle.
   * @param {Endboss}         enemy  - The endboss instance.
   */
  handleBottleHitEndboss(bottle, enemy) {
    if (!enemy.isHitBlocked()) {
      enemy.takeHit();
      this.statusbarEndboss.setPercentage(enemy.getHealthPercentage());
      bottle.splash();
    }
    if (enemy.isDead()) {
      setTimeout(() => {
        const i = this.level.enemies.indexOf(enemy);
        if (i !== -1) this.level.enemies.splice(i, 1);
      }, 800);
    }
  }
  /** Periodically checks if the game-over condition is met (character dead or endboss dead). */
  checkGameOver() {
    setStoppableInterval(() => {
      if (this.gameEnded) return;
      if (this.character.isDead()) {
        this.gameEnded = true;
        setTimeout(() => this.showEndScreen('lose'), 1500);
      } else if (this.endboss && this.endboss.isDead()) {
        this.gameEnded = true;
        setTimeout(() => this.showEndScreen('win'), 1500);
      }
    }, 200);
  }

  /**
   * Displays the win or lose overlay image and plays the matching end sound.
   * @param {'win'|'lose'} result - Outcome of the game.
   */
  showEndScreen(result) {
    const overlay = document.getElementById('endScreenOverlay');
    const img = document.getElementById('endScreenImg');
    img.src = result === 'win'
      ? 'img/You won, you lost/You Won B.png'
      : 'img/You won, you lost/You lost.png';
    overlay.style.display = 'flex';
    stopGame();
    if (result === 'win') this.winSound.play().catch(() => {});
    else this.loseSound.play().catch(() => {});
  }

  /** Periodically checks whether the character collects a coin and updates the coin bar. */
  checkCoinCollect() {
    setStoppableInterval(() => {
      this.level.coins = this.level.coins.filter(coin => {
        if (this.character.isColliding(coin)) {
          this.collectedCoins++;
          this.statusbarCoin.setPercentage(Math.min(this.collectedCoins / this.maxCoins * 100, 100));
          this.coinSound.currentTime = 0;
          this.coinSound.play().catch(() => {});
          return false;
        }
        return true;
      });
    }, 100);
  }

  /** Periodically handles bottle throwing input and cleans up deleted bottle objects. */
  checkThrow() {
    setStoppableInterval(() => {
      if (this.isMovementLocked()) {
        this.throwableObjects = this.throwableObjects.filter(obj => !obj.markedForDeletion);
        return;
      }
      if ((this.keyboard.D || this.keyboard.SPACE) && this.canThrow && this.collectedBottles > 0) {
        this.throwBottle();
      }
      this.throwableObjects = this.throwableObjects.filter(obj => !obj.markedForDeletion);
    }, 100);
  }

  /** Creates and launches a bottle in the character's current facing direction. */
  throwBottle() {
    const direction = this.character.otherDirection ? -1 : 1;
    const bottle = new ThrowableObject(this.character.x + 50, this.character.y + 100, direction);
    bottle.breakSound.muted = isMuted;
    this.throwableObjects.push(bottle);
    this.collectedBottles--;
    this.statusbarBottle.setPercentage(this.collectedBottles * 20);
    this.canThrow = false;
    setTimeout(() => this.canThrow = true, 500);
  }
}
