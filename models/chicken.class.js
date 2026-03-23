class Chicken extends movableObject {


    constructor() {
        super();
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500; // Random x position between 400 and 900
        this.y = 320; // Ground level for the chicken
        this.width = 100;
        this.height = 150;
    }
}