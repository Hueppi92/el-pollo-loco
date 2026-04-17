class StatusbarBottle extends DrawableObject {

  IMAGES = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
  ];

  percentage = 0;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
    this.x = 20;
    this.y = 126;
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
