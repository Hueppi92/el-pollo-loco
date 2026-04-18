document.addEventListener('DOMContentLoaded', () => {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    if (isTouch) {
        document.getElementById('mobileControls').style.display = 'flex';
    }
});

let canvas;
let world;
let keyboard;
let gameStarted = false;
let intervalIds = [];

function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
}

function stopGame() {
    intervalIds.forEach(clearInterval);
    intervalIds = [];
    if (world) {
        cancelAnimationFrame(world._rafId);
        world.bg_audio.pause();
        world.endSound.pause();
    }
}

function startGame() {
  keyboard = new Keyboard();
  document.getElementById("startScreenOverlay").style.display = "none";
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  ctx = canvas.getContext("2d");
  gameStarted = true;
}

function toggleMute() {
    const muted = world ? !world.bg_audio.muted : false;
    const btn = document.getElementById('muteBtn');
    if (world) {
        world.bg_audio.muted = muted;
        world.endSound.muted = muted;
        world.coinSound.muted = muted;
    }
    document.querySelectorAll('audio').forEach(a => a.muted = muted);
    btn.textContent = muted ? '🔇' : '🔊';
}

function toggleFullscreen() {
    const container = document.getElementById('gameContainer');
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
