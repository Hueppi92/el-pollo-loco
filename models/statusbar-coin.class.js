class StatusbarCoin extends DrawableObject {

  IMAGES = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
  ];

  percentage = 0;

  /** Initialises the coin status bar at 0 % and positions it on the HUD. */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
    this.x = 20;
    this.y = 68;
    this.width = 200;
    this.height = 50;
  }

  /**
   * Updates the bar's stored percentage and refreshes the displayed image.
   * @param {number} percentage - New value between 0 and 100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.chooseImage(percentage);
  }

  /**
   * Selects and applies the image matching the given percentage.
   * @param {number} percentage - Value between 0 and 100.
   */
  chooseImage(percentage) {
    let index = this.resolveImageIndex(percentage);
    this.img = this.imageCache[this.IMAGES[index]];
  }

  /**
   * Maps a percentage value to the corresponding image-array index (0–5).
   * @param {number} percentage - Value between 0 and 100.
   * @returns {number}
   */
  resolveImageIndex(percentage) {
    if (percentage >= 100) return 5;
    else if (percentage >= 80) return 4;
    else if (percentage >= 60) return 3;
    else if (percentage >= 40) return 2;
    else if (percentage >= 20) return 1;
    else return 0;
  }
}
