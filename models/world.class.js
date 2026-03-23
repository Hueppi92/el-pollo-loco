class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];

  backgroundObjects = [
    new BackgroundObject('img/5_background/first_half_background.png'),
    new BackgroundObject('img/5_background/second_half_background.png')
  ];
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addToMap(this.character);

    this.enemies.forEach((enemy) => {
      this.addToMap(enemy);
    });

    this.clouds.forEach((cloud) => {
      this.addToMap(cloud);
    });

    this.backgroundObjects.forEach((backgroundObject) => {
      this.addToMap(backgroundObject);
    });

    requestAnimationFrame(() => this.draw());
  }

  addToMap(movableObject) {
    this.ctx.drawImage(
      movableObject.img,
      movableObject.x,
      movableObject.y,
      movableObject.width,
      movableObject.height
    );
  }
}