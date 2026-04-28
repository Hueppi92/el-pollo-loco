class BackgroundObject extends DrawableObject {
  width = 720;
  height = 480;

  /**
   * @param {string} imagePath - Path to the background layer image.
   * @param {number} x         - Horizontal position in the level.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
