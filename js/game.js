let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
     world = new World(canvas, keyboard);

    ctx = canvas.getContext("2d");

   

    console.log('my Character', world.character);
    console.log('my Enemies', world.enemies);
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
