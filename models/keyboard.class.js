/**
 * Tracks the current pressed state of all relevant input keys and touch buttons.
 * Keyboard events are bound globally on the window; touch/mouse events are bound
 * to the on-screen mobile control buttons.
 */
class Keyboard {
    /** @type {boolean} Whether the left-arrow / left-button is held down. */
    LEFT = false;
    /** @type {boolean} Whether the right-arrow / right-button is held down. */
    RIGHT = false;
    /** @type {boolean} Whether the up-arrow / jump-button is held down. */
    UP = false;
    /** @type {boolean} Whether the down-arrow is held down. */
    DOWN = false;
    /** @type {boolean} Whether the Space key is held down. */
    SPACE = false;
    /** @type {boolean} Whether the D key or throw-button is held down. */
    D = false;

    constructor() {
        this.bindKeyPressEvents();
        this.bindBtsPressEvents();
    }

    /** Binds {@link KeyboardEvent} listeners on the window to track arrow keys and Space. */
    bindKeyPressEvents() {
        window.addEventListener('keydown', e => {
            if (e.code === 'ArrowLeft')  { this.LEFT  = true; e.preventDefault(); }
            if (e.code === 'ArrowRight') { this.RIGHT = true; e.preventDefault(); }
            if (e.code === 'ArrowUp')    { this.UP    = true; e.preventDefault(); }
            if (e.code === 'ArrowDown')  { this.DOWN  = true; e.preventDefault(); }
            if (e.code === 'Space')      { this.D = true; this.SPACE = true; e.preventDefault(); }
        });
        window.addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft')  { this.LEFT  = false; e.preventDefault(); }
            if (e.code === 'ArrowRight') { this.RIGHT = false; e.preventDefault(); }
            if (e.code === 'ArrowUp')    { this.UP    = false; e.preventDefault(); }
            if (e.code === 'ArrowDown')  { this.DOWN  = false; e.preventDefault(); }
            if (e.code === 'Space')      { this.D = false; this.SPACE = false; e.preventDefault(); }
        });
    }

    /**
     * Binds touch and mouse listeners to each on-screen mobile control button so
     * that the corresponding key flag is set while the button is pressed.
     */
    bindBtsPressEvents() {
        const bind = (id, key) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.addEventListener('touchstart', e => { e.preventDefault(); this[key] = true; },  { passive: false });
            btn.addEventListener('touchend',   e => { e.preventDefault(); this[key] = false; }, { passive: false });
            btn.addEventListener('mousedown',  e => { this[key] = true; });
            btn.addEventListener('mouseup',    e => { this[key] = false; });
            btn.addEventListener('mouseleave', e => { this[key] = false; });
        };
        bind('btnLeft',  'LEFT');
        bind('btnRight', 'RIGHT');
        bind('btnJump',  'UP');
        bind('btnThrow', 'D');
    }
}