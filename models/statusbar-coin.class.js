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

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
    this.x = 20;
    this.y = 68;
    this.width = 200;
    this.height = 50;
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    this.chooseImage(percentage);
  }

  chooseImage(percentage) {
    let index = this.resolveImageIndex(percentage);
    this.img = this.imageCache[this.IMAGES[index]];
  }

  resolveImageIndex(percentage) {
    if (percentage >= 100) return 5;
    else if (percentage >= 80) return 4;
    else if (percentage >= 60) return 3;
    else if (percentage >= 40) return 2;
    else if (percentage >= 20) return 1;
    else return 0;
  }
}
