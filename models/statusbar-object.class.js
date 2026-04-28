/**
 * A generic, reusable status bar that can represent health, coins, bottles, or any
 * percentage-based value. Pass the appropriate image set and position on construction.
 * @extends DrawableObject
 */
class Statusbar extends DrawableObject {
  IMAGES = [];
  percentage = 100;

  /**
   * @param {string[]} images - Array of exactly 6 image paths (0 % → 100 %).
   * @param {number}   x      - Horizontal canvas position in pixels.
   * @param {number}   y      - Vertical canvas position in pixels.
   * @param {number}   [initialPercentage=100] - Starting percentage value.
   */
  constructor(images, x, y, initialPercentage = 100) {
    super();
    this.IMAGES = images;
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 50;
    this.setPercentage(initialPercentage);
  }

  /**
   * Updates the displayed image to match the given percentage.
   * @param {number} percentage - Value between 0 and 100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let index = this.resolveImageIndex();
    this.img = this.imageCache[this.IMAGES[index]];
  }

  /**
   * Maps the current percentage to an image-array index (0–5).
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
  }
}

