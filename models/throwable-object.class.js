/**
 * Represents a throwable object within the game, capable of rotating in the air and creating a splash effect upon impact.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {

    rotateAnimationInterval = null;
    splashAnimationInterval = null;

    IMAGES_ROTATE_THROWABLEOBJECT = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH_BOTTLE = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    splash_sound = new Audio('audio/glassBroken.mp3');
    throw_sound = new Audio('audio/trow_sound.mp3');

    /**
     * Constructs a new ThrowableObject with specified initial position and direction.
     * @param {number} x - The initial x position.
     * @param {number} y - The initial y position.
     * @param {string} direction - The direction of throw ("left" or "right").
     */
    constructor(x, y, direction) {
        super();
        this.loadImages(this.IMAGES_ROTATE_THROWABLEOBJECT);
        this.loadImages(this.IMAGES_SPLASH_BOTTLE);
        this.x = x;
        this.y = y;
        this.height = 140;
        this.width = 156;
        this.trajectory(direction);
        this.animateTrowRotation();
    }

    /**
     * Initiates the trajectory of the throwable object based on its direction.
     * @param {string} direction - The direction of the throw.
     */
    trajectory(direction) {
        this.speedY = 5;
        this.applyGravity();
        this.throwInterval = setInterval(() => this.checkSideOfThrow(direction), 25);
    }

    /**
     * Checks which side the object is thrown to and adjusts its trajectory accordingly.
     * @param {string} direction - The direction of the throw.
     */
    checkSideOfThrow(direction) {
        this.isRightSide(direction) ? this.throwToRight() : this.throwToLeft();
    }

    /**
     * Moves the throwable object to the right as part of its trajectory.
     */
    throwToRight() {
        this.x += 30
    }

    /**
     * Moves the throwable object to the left as part of its trajectory.
     */
    throwToLeft() {
        this.x -= 30
    }

    /**
     * Determines if the throw direction is to the right.
     * @param {string} direction - The direction of the throw.
     * @returns {boolean} True if the direction is 'right', false otherwise.
     */
    isRightSide(direction) {
        return direction === 'right'
    }

    /**
     * Initiates the rotation animation for the throwable object.
     */
    animateTrowRotation() {
        this.rotateAnimationInterval = setInterval(() => this.playAnimation(this.IMAGES_ROTATE_THROWABLEOBJECT), 30);
    }

    /**
     * Starts the splash animation after the throwable object makes contact.
     */
    animateSplashAnimation() {
        clearInterval(this.rotateAnimationInterval);
        this.splashAnimationInterval = setInterval(() => this.splashAnimation(this.IMAGES_SPLASH_BOTTLE), 50);
    }

    /**
     * Executes the splash animation frame by frame until completion.
     * @param {string[]} img - The array of image paths for the splash animation.
     */
    splashAnimation(img) {
        this.isSmallerThanDeadImages(img) ? this.updateToNextDeadImage(img) : this.stopSplashAnimation();
    }

    /**
     * Stops the splash animation and marks the object as splashed.
     */
    stopSplashAnimation() {
        clearInterval(this.splashAnimationInterval);
        this.isSplashed = true;
    }

    /**
     * Plays the splash sound effect.
     */
    playSplashSound() {
        if (!isMute) this.splash_sound.play();
    }

    /**
     * Plays the sound effect for throwing the object.
     */
    playThrowSound() {
        this.throw_sound.currentTime = 0;
        if (this.canPlaySound()) this.throw_sound.play();
    }

    /**
     * Executes the splash animation and plays the corresponding sound effect.
     */
    processOfSplashThrowableObject() {
        this.animateSplashAnimation();
        this.playSplashSound();
    }
}