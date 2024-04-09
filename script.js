let arrowLeftButton = document.getElementById('arrow_left_touch_element');
let arrowRightButton = document.getElementById('arrow_right_touch_element');
let jumpButton = document.getElementById('jump_touch_element');
let throwButton = document.getElementById('throw_touch_element');
let stayButton = document.getElementById('stay_touch_element');

let content = document.getElementById('content');

let contentScreen = document.getElementById('content_screen');
let keylist = document.getElementById('key_list');

/**
 * Prevents the default action for the dragstart event.
 */
window.addEventListener('dragstart', function (event) {
    event.preventDefault();
});

/**
 * Adds event listeners to handle UI adjustments for mobile devices and fullscreen changes.
 */
window.addEventListener('resize', () => {
    handleOrientationChangeForMobileDevices();
    checkWidth();
});

document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

/**
 * Initializes the game, sets up the first level, and adjusts the UI for touch devices.
 */
function init() {
    checkWidth();
    initLevel1();
    if (isTouchDevice()) handleOrientationChangeForMobileDevices();
}

/**
 * Checks if the device orientation is portrait and narrow, and shows or hides the turn-your-phone note accordingly.
 */
function checkWidth() {
    let turnYourPhoneNote = document.getElementById('turnYourPhoneNote');
    isPortraitAndNarrow() ? showTheElement(turnYourPhoneNote) : hideTheElement(turnYourPhoneNote);
}

/**
 * Determines if the device is in a portrait orientation and narrower than a specified width.
 * @returns {boolean} True if the device is in a portrait orientation and narrower than 400 pixels.
 */
function isPortraitAndNarrow() {
    return window.innerWidth < window.innerHeight && window.innerWidth < 500;
}

/**
 * Adjusts the UI based on the device's orientation whenever the window size changes.
 */
function exitHandler() {
    if (isNotInFullscreenModus()) showFullscreenImage();
}

/**
 * Checks if the document is not in fullscreen mode.
 * @returns {boolean} True if the document is not in fullscreen mode, false otherwise.
 */
function isNotInFullscreenModus() {
    !document.fullscreenElement &&
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
}

/**
 * Requests fullscreen mode for the content screen.
 */
function openFullscreen() {
    openTheTypeOfFullscreen();
    showFullscreenExitImage();
}

/**
 * Exits fullscreen mode for the document.
 */
function closeFullscreen() {
    closeTheTypeOfFullscreen();
    showFullscreenImage();
}

/**
 * Handles closing the default fullscreen mode or adjusts UI for mobile devices.
 */
function closeTheTypeOfFullscreen() {
    if (isTouchAndMobileDevice()) {
        isFullscreen = false;
        handleOrientationChangeForMobileDevices();
    } else {
        exitDefaultHandleOrientationChange();
    }
}

/**
 * Handles opening the default fullscreen mode or adjusts UI for mobile devices.
 */
function openTheTypeOfFullscreen() {
    if (isTouchAndMobileDevice()) {
        isFullscreen = true;
        handleOrientationChangeForMobileDevices();
    } else {
        openDefaultHandleOrentationChange();
    }
}

/**
 * Requests the default fullscreen mode for various browsers.
 */
function openDefaultHandleOrentationChange() {
    if (contentScreen.requestFullscreen) {
        contentScreen.requestFullscreen();
    } else if (contentScreen.webkitRequestFullscreen) {
        contentScreen.webkitRequestFullscreen();
    } else if (contentScreen.msRequestFullscreen) {
        contentScreen.msRequestFullscreen();
    }
}

/**
 * Exits the default fullscreen mode for various browsers.
 */
function exitDefaultHandleOrientationChange() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Adjusts the UI based on the device's orientation and fullscreen status.
 */
function handleOrientationChangeForMobileDevices() {
    if (mobileIsInPortraitFormat()) {
        checkFullscreenModeInPortraitFormat();
    } else if (mobileIsInLandscapeFormat()) {
        checkFullscreenModeInLandscapeFormat();
    }
}

/**
 * Adjusts UI based on fullscreen mode and device orientation in portrait format.
 */
function checkFullscreenModeInPortraitFormat() {
    if (isFullscreen) {
        fullscreenModusOnMobileInPortraitFormat();
    } else {
        noneFullscreenModusOnMobileInPortraitFormat();
    }
}

/**
 * Adjusts UI based on fullscreen mode and device orientation in landscape format.
 */
function checkFullscreenModeInLandscapeFormat() {
    if (isFullscreen) {
        fullscreenModusOnMobileInLandscapeFormat();
    } else {
        noneFullscreenModusOnMobileInLandscapeFormat();
    }
}

/**
 * Applies fullscreen mode styles for mobile devices in portrait orientation.
 */
function fullscreenModusOnMobileInPortraitFormat() {
    contentScreen.style.width = '100vw';
    content.style.height = '100vh';
    content.style.alignItems = 'center';
    hideTheElement(keylist);
}

/**
 * Applies non-fullscreen mode styles for mobile devices in portrait orientation.
 */
function noneFullscreenModusOnMobileInPortraitFormat() {
    contentScreen.style.width = '95vw';
    content.style.height = '100vh';
    content.style.justifyContent = 'center';
    showTheElement(keylist);
}

/**
 * Applies fullscreen mode styles for mobile devices in landscape orientation.
 */
function fullscreenModusOnMobileInLandscapeFormat() {
    contentScreen.style.width = '82vw';
    content.style.alignItems = 'baseline';
    content.style.justifyContent = 'center';
    hideTheElement(keylist);
}

/**
 * Applies non-fullscreen mode styles for mobile devices in landscape orientation.
 */
function noneFullscreenModusOnMobileInLandscapeFormat() {
    contentScreen.style.width = '76vw';
    content.style.height = '100vh';
    content.style.overflow = 'hidden';
    content.style.alignItems = 'center';
    content.style.justifyContent = 'space-evenly';
    showTheElement(keylist);
}

/**
 * Shows touch movement elements on the screen.
 */
function showTouchMovementElements() {
    showTheElement(arrowLeftButton);
    showTheElement(arrowRightButton);
    showTheElement(jumpButton);
    showTheElement(throwButton);

    if (isIosMobileDevice()) showTheElement(stayButton);
}

/**
 * Hides touch movement elements from the screen.
 */
function hideTouchMovementElements() {
    hideTheElement(arrowLeftButton);
    hideTheElement(arrowRightButton);
    hideTheElement(jumpButton);
    hideTheElement(throwButton);
    hideTheElement(stayButton);
}

/**
 * Determines if the device is in portrait orientation.
 * @returns {boolean} True if the device is in portrait format and is a mobile device, false otherwise.
 */
function mobileIsInPortraitFormat() {
    return window.innerHeight > window.innerWidth &&
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Determines if the device is in landscape orientation.
 * @returns {boolean} True if the device is in landscape format and is a mobile device, false otherwise.
 */
function mobileIsInLandscapeFormat() {
    return window.innerHeight < window.innerWidth &&
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Checks if the device supports touch interactions.
 * @returns {boolean} True if the device is a touch device, false otherwise.
 */
function isTouchDevice() {
    return navigator.maxTouchPoints > 0;
}

/**
 * Determines if the device is both a touch device and a mobile device.
 * @returns {boolean} True if the device is a touch and mobile device, false otherwise.
 */
function isTouchAndMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0;
}

/**
 * Checks if the device is an iOS mobile device.
 * @returns {boolean} True if the device is an iOS mobile device, false otherwise.
 */
function isIosMobileDevice() {
    return /iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**
 * Hides an HTML element.
 * @param {HTMLElement} el - The element to hide.
 */
function hideTheElement(el) {
    el.classList.add('d-none');
}

/**
 * Shows an HTML element.
 * @param {HTMLElement} el - The element to show.
 */
function showTheElement(el) {
    el.classList.remove('d-none');
}