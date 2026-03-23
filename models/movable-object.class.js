class movableObject {
    x;
    y;

    img;
    height;
    width;
    zIndex=3; // Default z-index for movable objects

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

     moveRight() {
        this.x += 5;
    }
    moveLeft() {
        this.x -= 5;      
    }
   
}