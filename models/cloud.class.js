class Cloud extends movableObject {
    y = 50;
    width = 500;
    height = 250;
    speed = 0.15;

    /** Sets a random starting x position and starts the scroll animation. */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 200 + Math.random() * 500;
        this.animate();
    }

    /** Scrolls the cloud continuously to the left. */
    animate(){
       this.moveLeft();
    }
}