class Statusbar extends DrawableObject {
  
  IMAGES = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
  ];

percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES);

    
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

