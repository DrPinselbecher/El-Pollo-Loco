let canvas;
let world;
let keyboard = new Keyboard();
let isFullscreen = false;
let maximumLevelReached = false;
let buttonsDelayID;
let isMute = false;


/**
 * Initializes the game world and assigns the canvas and keyboard controls.
 */
function initGame() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

/**
 * Starts the game by initializing game components and displaying the game UI.
 */
function startGame() {
    initGame();
    showTheGame();
}

/**
 * Restarts the current game level, hiding the game over window and re-initializing touch elements.
 */
function restartGame() {
    checkCurrentLevel();
    hideGameOverWindow();
    checkWhetherInitTouchElements();
    initGame();
    if (isIosMobileDevice()) clearClickEventlistenerOnIOSDevices();
}

/**
 * Initializes the next game level after the current level is completed.
 */
function initNextLevel() {
    checkNextLevel();
    hideGameOverWindow();
    initGame();
    checkWhetherInitTouchElements();
    if (isIosMobileDevice()) clearClickEventlistenerOnIOSDevices();
}

/**
 * Displays the game over window with a message based on the game's completion status.
 * @param {'win'|'lose'} status - The completion status of the game.
 */
function showGameOverWindow(status) {
    let background = document.getElementById('darken_bgr');

    showTheElement(background);
    showMessageBasedOnTheStatus(status);
    initGameOverButtons(status);
    hideTouchMovementElements();
    clearAllIntervals();
}

/**
 * Determines if the user has won the current level.
 * @param {'win'|'lose'} status - The completion status of the game.
 * @returns {boolean} True if the user has won, false otherwise.
 */
function userWonThisLevel(status) {
    return status === 'win';
}

/**
 * Displays a message based on the game's completion status.
 * @param {'win'|'lose'} status - The completion status of the game.
 */
function showMessageBasedOnTheStatus(status) {
    let lostMessage = document.getElementById('lost_image');
    let winMessage = document.getElementById('win_image');

    userWonThisLevel(status) ? showTheElement(winMessage) : showTheElement(lostMessage);
}

/**
 * Initializes game over buttons with a delay.
 * @param {'win'|'lose'} status - The completion status of the game.
 */
function initGameOverButtons(status) {
    buttonsDelayID = setTimeout(() => showButtons(status), 4200);
}

/**
 * Shows the appropriate game over buttons based on the game's completion status.
 * @param {'win'|'lose'} status - The completion status of the game.
 */
function showButtons(status) {
    showNextLevelButtonBasedOnTheStatus(status);
    showRestartLevelButton();
}

/**
 * Displays the next level button based on the game's completion status.
 * @param {'win'|'lose'} status - The completion status of the game.
 */
function showNextLevelButtonBasedOnTheStatus(status) {
    let nextLevelButton = document.getElementById('next_level_btn');

    isLevelWonAndNotLastLevel(status) ? showEnabledNextLevelButton(nextLevelButton) : showDisabledNextLevelButton(nextLevelButton);
}

/**
 * Checks if the level was won and it's not the last level.
 * @param {'win'|'lose'} status - The completion status of the game.
 * @returns {boolean} True if the level was won and it's not the last level, false otherwise.
 */
function isLevelWonAndNotLastLevel(status) {
    return userWonThisLevel(status) && !maximumLevelReached;
}

/**
 * Displays the next level button as enabled.
 * @param {HTMLButtonElement} btn - The next level button.
 */
function showEnabledNextLevelButton(btn) {
    addAttributesToEnabledNextLevelButton(btn);
    showTheElement(btn);
}

/**
 * Adds attributes to an enabled next level button.
 * @param {HTMLButtonElement} btn - The next level button.
 */
function addAttributesToEnabledNextLevelButton(btn) {
    btn.onclick = initNextLevel;
    btn.disabled = false;
    btn.classList.remove('buttonDisabled');
    btn.classList.add('nextLevelBtn');
}

/**
 * Displays the next level button as disabled.
 * @param {HTMLButtonElement} btn - The next level button.
 */
function showDisabledNextLevelButton(btn) {
    addAttributesToDisableNextLevelButton(btn);
    showTheElement(btn);
}

/**
 * Adds attributes to a disabled next level button.
 * @param {HTMLButtonElement} btn - The next level button.
 */
function addAttributesToDisableNextLevelButton(btn) {
    btn.disabled = true;
    btn.classList.remove('nextLevelBtn');
    btn.classList.add('buttonDisabled');
}

/**
 * Shows the restart level button.
 */
function showRestartLevelButton() {
    let restartLevel = document.getElementById('try_again_btn');

    restartLevel.classList.remove('d-none');
    restartLevel.onclick = restartGame;
}

/**
 * Clears all intervals except for the buttons delay ID.
 */
function clearAllIntervals() {
    for (let i = 0; i < 99999; i++) if (i !== buttonsDelayID) window.clearInterval(i);
}

/**
 * Hides the game over window and related elements.
 */
function hideGameOverWindow() {
    let elementsToHide = ['next_level_btn', 'try_again_btn', 'darken_bgr', 'lost_image', 'win_image'];
    elementsToHide.forEach(id => hideTheElement(document.getElementById(id)));
}

/**
 * Displays the game by showing specific elements and hiding others.
 */
function showTheGame() {
    let elementsToShow = ['loud_icon', 'fullscreen', 'canvas'];
    let elementsToHide = ['start_screen'];

    elementsToShow.forEach(id => showTheElement(document.getElementById(id)));
    elementsToHide.forEach(id => hideTheElement(document.getElementById(id)));

    checkWhetherInitTouchElements();
}

/**
 * Displays the image to exit fullscreen mode.
 */
function showFullscreenExitImage() {
    let elementsToShow = ['fullscreen_exit'];
    let elementsToHide = ['fullscreen'];

    elementsToHide.forEach(id => hideTheElement(document.getElementById(id)));
    elementsToShow.forEach(id => showTheElement(document.getElementById(id)));

    isFullscreen = true;
}

/**
 * Displays the image to enter fullscreen mode.
 */
function showFullscreenImage() {
    let elementsToShow = ['fullscreen'];
    let elementsToHide = ['fullscreen_exit'];

    elementsToShow.forEach(id => showTheElement(document.getElementById(id)));
    elementsToHide.forEach(id => hideTheElement(document.getElementById(id)));

    isFullscreen = false;
}

/**
 * Initializes touch elements if the device supports touch.
 */
function checkWhetherInitTouchElements() {
    if (isTouchDevice()) {
        showTouchMovementElements();
        bindBTNPressEvents();
    } else {
        return;
    }
}

/**
 * Toggles the game's volume on and off.
 */
function toggleVolume() {
    toggleVolumeImages();
    world.toggleMute();
}

/**
 * Switches the volume icon based on the current volume state.
 */
function toggleVolumeImages() {
    let muteImage = document.getElementById('mute_icon');
    let loudImage = document.getElementById('loud_icon');

    if (isMute) {
        loudImage.classList.remove('d-none');
        muteImage.classList.add('d-none');
    } else {
        muteImage.classList.remove('d-none');
        loudImage.classList.add('d-none');
    }
}

/**
 * Binds button press events for touch or click based on the device type.
 */
function bindBTNPressEvents() {
    checkIfIsIosMobileDevice();
    characterJumpTouchEventListener();
    characterThrowObjectTouchEventListener();
}

/**
 * Checks if the device is an iOS mobile device to determine the type of event listener to add.
 */
function checkIfIsIosMobileDevice() {
    isIosMobileDevice() ? addClickEventListenerToBTN() : addTouchEventListenerToBTN();
}

/**
 * Adds touch event listeners to movement and action buttons.
 */
function addTouchEventListenerToBTN() {
    characterGoLeftTouchEventListener();
    characterGoRightTouchEventListener();
}

/**
 * Adds click event listeners to movement and action buttons for iOS devices.
 */
function addClickEventListenerToBTN() {
    characterGoLeftClickEventListener();
    characterGoRightClickEventListener();
    characterStayClickEventListener();
}

/**
 * Adds a touchstart event listener to move the character left.
 */
function characterGoLeftTouchEventListener() {
    arrowLeftButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
    });

    arrowLeftButton.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
    });
}

/**
 * Adds a touchstart event listener to move the character right.
 */
function characterGoRightTouchEventListener() {
    arrowRightButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
    });

    arrowRightButton.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
    });
}

/**
 * Adds touch event listeners for the character to jump.
 */
function characterJumpTouchEventListener() {
    jumpButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
    });

    jumpButton.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
    });
}

/**
 * Adds touch event listeners for the character to throw an object.
 */
function characterThrowObjectTouchEventListener() {
    throwButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        keyboard.F = true;
    });

    throwButton.addEventListener("touchend", (e) => {
        e.preventDefault();
        keyboard.F = false;
    });
}

/**
 * Adds a click event listener to move the character left.
 */
function characterGoLeftClickEventListener() {
    document.getElementById('arrow_left_touch_element').addEventListener('click', (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
        keyboard.RIGHT = false;
    });
}

/**
 * Adds a click event listener to move the character right.
 */
function characterGoRightClickEventListener() {
    document.getElementById('arrow_right_touch_element').addEventListener('click', (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
        keyboard.LEFT = false;
    });
}

/**
 * Adds a click event listener to make the character stay in place.
 */
function characterStayClickEventListener() {
    stayButton.addEventListener('click', (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
        keyboard.LEFT = false;
        keyboard.UP = false;
        keyboard.F = false;
    });
}

/**
 * Resets the game's directional and action keys to false on iOS devices, preventing unintended movements or actions.
 */
function clearClickEventlistenerOnIOSDevices() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.F = false;
}