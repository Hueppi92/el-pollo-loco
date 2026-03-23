class Cloud extends movableObject {

    constructor() {
        super();
        this.loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 200 + Math.random() * 500; // Random x position between 400 and 900
        this.y = 50 + Math.random() * 100; // Random y position between 50 and 150
        this.width = 250;
        this.height = 150;
        this.zIndex = 2; // Set z-index to 2 to ensure it stays above the background but below characters and enemies
    }
}