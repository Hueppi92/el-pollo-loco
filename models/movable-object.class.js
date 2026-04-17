
class movableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 0.0;
  groundY = 140;
  health = 100;

  isAboveGround() {
    return this.y < this.groundY;
  }

  applyGravity() {
    setInterval(() => {
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

  // Drawing and image methods are now in DrawableObject

  moveRight() {
    setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
//Character.isColliding(chicken)
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.x < mo.x + mo.width &&
      this.y + this.height > mo.y &&
      this.y < mo.y + mo.height
    );
  }
  
 handleDamage(amount) {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }
}
