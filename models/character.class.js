class Character extends movableObject {
  x = 50;
  y = 150;
  width = 110;
  height = 280;
  IMAGES_WALKING = [  
            '/img/2_character_pepe/2_walk/W-21.png',
              '/img/2_character_pepe/2_walk/W-22.png',
              '/img/2_character_pepe/2_walk/W-23.png',
              '/img/2_character_pepe/2_walk/W-24.png',
              '/img/2_character_pepe/2_walk/W-25.png',
              '/img/2_character_pepe/2_walk/W-26.png'
    ];

  world;
  currentImage = 0;

  constructor() {
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');
   this.loadImages( this.IMAGES_WALKING);
  
   this.animate();

}  
animate () {
this.speed = 5;  
  setInterval(() => {
    if (this.world.keyboard.RIGHT) {
      this.x += this.speed;
    } else if (this.world.keyboard.LEFT) {
      this.x -= this.speed;
    }
  }, 1000 / 60);
 

  setInterval(() => {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      let i = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }
  }, 80);
}
    jump() {
      
  }
}