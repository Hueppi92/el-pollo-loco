class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    D = false;

    constructor() {
        this.bindKeyPressEvents();
        this.bindBtsPressEvents();
    }

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