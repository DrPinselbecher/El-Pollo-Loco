/**
 * Base class for objects that can be drawn in the game.
 */
class DrawableObject {
    x;
    y = 500;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads an image for the object.
     * @param {string} path - The path to the image.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads a single image and stores it in the cache.
     * @param {string} path - The path to the image.
     */
    loadAndCacheImage(path) {
        let img = new Image();
        img.onload = () => {
            this.imageCache[path] = img;
        };
        img.src = path;
    }

    /**
     * Draws the object's image on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D drawing context of the canvas.
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (error) {
        }
    }

    /**
    * Loads multiple images for animations.
    * @param {string[]} arr - An array of image paths.
    */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Plays an animation.
     * @param {string[]} images - An array of image paths that represent the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Plays an animation with an end frame.
     * @param {string[]} images - An array of image paths that represent the animation.
     */
    playAnimationWithEnd(images) {
        this.resetAnimationIfNeeded();
        this.advanceAnimationOrHold(images);
    }

    /**
     * Resets the animation to its first frame if needed.
     */
    resetAnimationIfNeeded() {
        if (this.restartAnimationOnNextFrame) {
            this.currentImage = 0;
            this.restartAnimationOnNextFrame = false;
        }
    }

    /**
     * Advances the animation to the next frame or holds the last frame if at the end.
     * @param {string[]} images - An array of image paths that represent the animation frames.
     */
    advanceAnimationOrHold(images) {
        if (this.currentImage < images.length) {
            this.playAnimation(images);
            this.incrementImageIndex(images);
        } else {
            this.holdLastImage(images);
        }
    }

    /**
     * Increments the index to advance the animation frame, unless at the last image.
     * @param {string[]} images - An array of image paths that represent the animation frames.
     */
    incrementImageIndex(images) {
        if (this.currentImage < images.length - 1) {
            this.currentImage++;
        }
    }

    /**
     * Holds the last image in the animation sequence, preventing it from looping.
     * @param {string[]} images - An array of image paths that represent the animation frames.
     */
    holdLastImage(images) {
        let path = images[images.length - 1];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the current image index based on the object's percentage attribute.
     * @returns {number} The index of the image to display.
     */
    resolveImageIndex() {
        if (this.percentage <= 0) return 0;
        if (this.percentage < 40) return 1;
        if (this.percentage < 60) return 2;
        if (this.percentage < 80) return 3;
        if (this.percentage < 100) return 4;
        return 5;
    }

    /**
     * Checks if the conditions are right to play a sound effect.
     * @returns {boolean} True if sound can be played, false otherwise.
     */
    canPlaySound() {
        return !isMute && !world.stopKeyActivity;
    }
}