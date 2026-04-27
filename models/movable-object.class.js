
class movableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 0.0;
  groundY = 140;
  health = 100;

  /**
   * Returns true if the object is currently above its ground level.
   * @returns {boolean}
   */
  isAboveGround() {
    return this.y < this.groundY;
  }

  /** Applies gravity by continuously pulling the object toward its ground level. */
  applyGravity() {
    setStoppableInterval(() => {
      if (this.y > this.groundY) {
        this.y = this.groundY;
        this.speedY = 0;
        this.acceleration = 0;
      } else {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 60);
  }

  /** Moves the object to the right by its current speed. */
  moveRight() {
    this.x += this.speed;
  }

  /** Moves the object to the left by its current speed. */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Checks whether this object's collision box overlaps with another object's collision box.
   * Each side's offset is subtracted so the hitbox is tighter than the full sprite rectangle.
   * @param {movableObject} mo - The other object to test against.
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.offsetLeft                 < mo.x + mo.width - mo.offsetRight &&
      this.x + this.width - this.offsetRight   > mo.x + mo.offsetLeft &&
      this.y + this.offsetTop                  < mo.y + mo.height - mo.offsetBottom &&
      this.y + this.height - this.offsetBottom > mo.y + mo.offsetTop
    );
  }

  /**
   * Returns true when this object is moving downward and landing on top of another.
   * @param {movableObject} mo - The object below.
   * @returns {boolean}
   */
  isFallingOnTop(mo) {
    const thisBottom = this.y + this.height - this.offsetBottom;
    const otherTop = mo.y + mo.offsetTop;
    return this.speedY < 0 && thisBottom <= otherTop + 20;
  }

  /**
   * Returns true if the object has no health remaining.
   * @returns {boolean}
   */
  isDead() {
    return this.health <= 0;
  }

  /**
   * Reduces the object's health by the given amount, clamped at 0.
   * @param {number} amount - Damage to apply.
   */
  handleDamage(amount) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }
}
