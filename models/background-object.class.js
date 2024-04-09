/**
 * Represents a background object within the game world, extending movable object functionalities.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {

    width = 1920;
    height = 1080;

    /**
     * Creates an instance of a background object with a specific image and initial position.
     * @param {string} imagePath - The path to the background image.
     * @param {number} x - The initial x-coordinate of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 1080 - this.height;
    }
}