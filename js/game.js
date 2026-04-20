document.addEventListener('DOMContentLoaded', () => {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    if (isTouch) {
        document.getElementById('mobileControls').style.display = 'flex';
    }
    // Restore mute button icon from saved setting
    document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
});

/** @type {HTMLCanvasElement} */ let canvas;
/** @type {World}             */ let world;
/** @type {Keyboard}          */ let keyboard;
/** @type {boolean} Whether the game has been started at least once. */ let gameStarted = false;
/** @type {number[]} All active interval IDs, used to stop them cleanly. */ let intervalIds = [];
/** @type {boolean} Global mute state – loaded from localStorage so it survives page reloads. */
let isMuted = localStorage.getItem('elPollo_muted') === 'true';

/**
 * Registers a recurring interval that can be stopped via {@link stopGame}.
 * @param {Function} fn   - Callback to run repeatedly.
 * @param {number}   time - Interval delay in milliseconds.
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
}

/** Stops all registered intervals and cancels the render-animation-frame loop. */
function stopGame() {
    intervalIds.forEach(clearInterval);
    intervalIds = [];
    if (world) {
        cancelAnimationFrame(world._rafId);
        world.bg_audio.pause();
        world.endSound.pause();
        world.winSound.pause();
        world.winSound.currentTime = 0;
        world.loseSound.pause();
        world.loseSound.currentTime = 0;
    }
}

/** Creates a fresh level and world instance and starts the game loop. */
function startGame() {
    keyboard = new Keyboard();
    document.getElementById('startScreenOverlay').style.display = 'none';
    document.getElementById('menuBtn').style.display = 'flex';
    canvas = document.getElementById('canvas');
    level1 = createLevel1();
    world = new World(canvas, keyboard);
    gameStarted = true;
    applyMuteState();
}

/**
 * Stops the current game, resets the end screen, and immediately starts a new game.
 * Does NOT reload the page – all game objects are re-created cleanly.
 */
function restartGame() {
    stopGame();
    document.getElementById('endScreenOverlay').style.display = 'none';
    startGame();
}

/** Stops the game and returns to the start screen menu. */
function goToMenu() {
    stopGame();
    document.getElementById('endScreenOverlay').style.display = 'none';
    document.getElementById('startScreenOverlay').style.display = 'flex';
    document.getElementById('menuBtn').style.display = 'none';
    gameStarted = false;
    world = null;
}

/** Applies the current {@link isMuted} state to every audio object in the world. */
function applyMuteState() {
    if (world) world.muteAllSounds(isMuted);
}

/** Toggles mute on/off, persists the choice to localStorage, and updates all active sounds. */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('elPollo_muted', isMuted);
    document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
    applyMuteState();
}

/** Toggles the game container between fullscreen and normal mode. */
function toggleFullscreen() {
    const container = document.getElementById('gameContainer');
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
