class movableObject {
  x;
  y;

  img;
  height;
  width;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  moveRight() {
    this.x += 5;
  }
  moveLeft() {
    this.x -= 5;
  }
}
