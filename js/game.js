
let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

function startGame() {
    document.getElementById('startScreenOverlay').style.display = 'none';
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    ctx = canvas.getContext("2d");
    gameStarted = true;
}



window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case "ArrowLeft":
            keyboard.LEFT = true;
            event.preventDefault();
            break;
        case "ArrowRight":
            keyboard.RIGHT = true;
            event.preventDefault();
            break;
        case "ArrowUp":
            keyboard.UP = true;
            event.preventDefault();
            break;
        case "ArrowDown":
            keyboard.DOWN = true;
            event.preventDefault();
            break;
        case "Space":
            keyboard.SPACE = true;
            event.preventDefault();
            break;
   
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "ArrowLeft":
            keyboard.LEFT = false;
            event.preventDefault();
            break;
        case "ArrowRight":
            keyboard.RIGHT = false;
            event.preventDefault();
            break;
        case "ArrowUp":
            keyboard.UP = false;
            event.preventDefault();
            break;
        case "ArrowDown":
            keyboard.DOWN = false;
            event.preventDefault();
            break;
        case "Space":
            keyboard.SPACE = false;
            event.preventDefault();
            break;
       
    }
});
