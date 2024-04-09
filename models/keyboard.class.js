/**
 * Represents the state of the keyboard, tracking which keys are currently pressed.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    F = false;
    SPACE = false;
}

/**
 * Listens for keydown events and updates the keyboard state.
 */
window.addEventListener('keydown', (e) => {
    if (e.keyCode == 39 || e.keyCode == 68) keyboard.RIGHT = true;
    if (e.keyCode == 37 || e.keyCode == 65) keyboard.LEFT = true;
    if (e.keyCode == 38 || e.keyCode == 87) keyboard.UP = true;
    if (e.keyCode == 40 || e.keyCode == 83) keyboard.DOWN = true;
    if (e.keyCode == 70) keyboard.F = true;
    if (e.keyCode == 32) keyboard.SPACE = true;
});

/**
 * Listens for keyup events and resets the keyboard state.
 */
window.addEventListener('keyup', (e) => {
    if (e.keyCode == 39 || e.keyCode == 68) keyboard.RIGHT = false;
    if (e.keyCode == 37 || e.keyCode == 65) keyboard.LEFT = false;
    if (e.keyCode == 38 || e.keyCode == 87) keyboard.UP = false;
    if (e.keyCode == 40 || e.keyCode == 83) keyboard.DOWN = false;
    if (e.keyCode == 70) keyboard.F = false;
    if (e.keyCode == 32) keyboard.SPACE = false;
});