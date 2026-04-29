/**
 * Returns {@code true} when the page is running on a real mobile device.
 * Prefers the modern {@link NavigatorUAData.mobile} hint; falls back to
 * checking for coarse-pointer (touch-primary) input.
 * @returns {boolean}
 */
function detectMobile() {
    if (navigator.userAgentData?.mobile != null) return navigator.userAgentData.mobile;
    return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Shows or hides the portrait-mode rotate overlay based on the current viewport
 * dimensions. Works in DevTools responsive mode and on real devices because it
 * uses {@link window.innerWidth} / {@link window.innerHeight} rather than
 * {@link screen.width}.
 */
function updateRotateOverlay() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isSmallViewport = window.innerWidth < 900;
    const show = isPortrait && isSmallViewport;
    document.getElementById('rotateOverlay').classList.toggle('visible', show);
    document.body.classList.toggle('portrait-mode', show);
}

/**
 * Runs once the DOM is ready. Detects mobile devices to apply the
 * {@code is-mobile} class (enables the rotate-hint and mobile layout),
 * shows touch controls, restores the mute button icon, and performs the
 * initial rotate-overlay check.
 */
document.addEventListener('DOMContentLoaded', () => {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    if (detectMobile()) {
        document.body.classList.add('is-mobile');
    }
    if (isTouch) {
        document.getElementById('mobileControls').style.display = 'flex';
    }
    document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
    updateRotateOverlay();
});

window.addEventListener('resize', updateRotateOverlay);
window.addEventListener('orientationchange', updateRotateOverlay);

let canvas;
let world;
let keyboard;
let gameStarted = false;
let intervalIds = [];
let isMuted = localStorage.getItem('elPollo_muted') === 'true';

/**
 * Registers a recurring interval whose ID is tracked so it can be cleared by {@link stopGame}.
 * @param {Function} fn   - Callback to execute on each tick.
 * @param {number}   time - Interval delay in milliseconds.
 */
function setStoppableInterval(fn, time) {
    let id = setInterval(fn, time);
    intervalIds.push(id);
}

/**
 * Stops all registered intervals, cancels the render loop, and pauses every world
 * audio object. Safe to call even when no game is running.
 */
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

/**
 * Creates a fresh {@link Keyboard}, {@link Level}, and {@link World} instance,
 * hides the start screen, and kicks off the game loop.
 */
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
 * Stops the running game, hides the end screen, and immediately starts a fresh game.
 * All game objects are re-created in place – no page reload required.
 */
function restartGame() {
    stopGame();
    document.getElementById('endScreenOverlay').style.display = 'none';
    startGame();
}

/**
 * Stops the running game and navigates back to the start screen.
 * Resets {@link gameStarted} and clears the world reference.
 */
function goToMenu() {
    stopGame();
    document.getElementById('endScreenOverlay').style.display = 'none';
    document.getElementById('startScreenOverlay').style.display = 'flex';
    document.getElementById('menuBtn').style.display = 'none';
    gameStarted = false;
    world = null;
}

/**
 * Propagates the current {@link isMuted} flag to every audio object managed by
 * the active world. No-op when no world is running.
 */
function applyMuteState() {
    if (world) world.muteAllSounds(isMuted);
}

/**
 * Toggles the global mute state, persists it to localStorage, updates the button
 * icon, and applies the new state to all currently active sounds.
 */
function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('elPollo_muted', isMuted);
    document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
    applyMuteState();
}

/**
 * Requests fullscreen for the game container, or exits fullscreen if it is
 * already active. Uses the standard Fullscreen API.
 */
function toggleFullscreen() {
    const container = document.getElementById('gameContainer');
    if (!document.fullscreenElement) {
        container.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
