/**
 * Tracks the current pressed state of all relevant input keys and touch buttons.
 * Keyboard events are bound globally on the window; touch/mouse events are bound
 * to the on-screen mobile control buttons.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    /** Binds all keyboard and touch-button event listeners. */
    constructor() {
        this.bindKeyPressEvents();
        this.bindBtsPressEvents();
    }

    /** Binds keydown and keyup listeners on the window to track arrow keys and Space. */
    bindKeyPressEvents() {
        this.bindKeyDown();
        this.bindKeyUp();
    }

    /** Registers the keydown handler that sets key flags to true. */
    bindKeyDown() {
        window.addEventListener('keydown', e => {
            if (e.code === 'ArrowLeft')  { this.LEFT  = true; e.preventDefault(); }
            if (e.code === 'ArrowRight') { this.RIGHT = true; e.preventDefault(); }
            if (e.code === 'ArrowUp')    { this.UP    = true; e.preventDefault(); }
            if (e.code === 'ArrowDown')  { this.DOWN  = true; e.preventDefault(); }
            if (e.code === 'Space')      { this.D = true; this.SPACE = true; e.preventDefault(); }
        });
    }

    /** Registers the keyup handler that resets key flags to false. */
    bindKeyUp() {
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
        this.bindButton('btnLeft',  'LEFT');
        this.bindButton('btnRight', 'RIGHT');
        this.bindButton('btnJump',  'UP');
        this.bindButton('btnThrow', 'D');
    }

    /**
     * Attaches touchstart, touchend, mousedown, mouseup, and mouseleave listeners
     * to a single on-screen button so the given key flag tracks its pressed state.
     * @param {string} id  - The DOM id of the button element.
     * @param {string} key - The Keyboard property name to toggle (e.g. 'LEFT').
     */
    bindButton(id, key) {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('touchstart', e => { e.preventDefault(); this[key] = true; },  { passive: false });
        btn.addEventListener('touchend',   e => { e.preventDefault(); this[key] = false; }, { passive: false });
        btn.addEventListener('mousedown',  () => { this[key] = true; });
        btn.addEventListener('mouseup',    () => { this[key] = false; });
        btn.addEventListener('mouseleave', () => { this[key] = false; });
    }
}