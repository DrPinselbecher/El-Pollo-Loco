/**
 * Represents a collectible bottle object in the game, capable of changing its image randomly and playing a sound upon collection.
 * @extends DrawableObject
 */
class Bottle extends DrawableObject {
    width = 140;
    height = 140;

    collect_bottle_sound = new Audio('audio/collectThrowableObject.mp3');

    /**
     * Initializes a new Bottle object at a specific position and sets a random image for it.
     * @param {number} x - The x-coordinate of the bottle.
     * @param {number} y - The y-coordinate of the bottle.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.setRandomImage();
    }

    /**
     * Sets a random image for the bottle from a predefined set.
     */
    setRandomImage() {
        let images = [
            'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ];
        this.updateAndLoadBottleImage(images);
    }

    /**
     * Loads the next bottle image based on the selected random image.
     * @param {string[]} images - An array of image paths.
     */
    updateAndLoadBottleImage(images) {
        let nextBottleImage = this.selectNextBottleImage(images);
        Bottle.lastSelectedImage = nextBottleImage;
        this.loadImage(nextBottleImage);
    }

    /**
     * Selects the next bottle image randomly, ensuring it is different from the last selected image.
     * @param {string[]} images - An array of image paths.
     * @returns {string} The path of the next bottle image.
     */
    selectNextBottleImage(images) {
        let filteredImages = images.filter(image => image !== Bottle.lastSelectedImage);
        return this.chooseRandomlyFromFilteredImages(filteredImages);
    }

    /**
     * Chooses an image randomly from the filtered images.
     * @param {string[]} filteredImages - An array of filtered image paths.
     * @returns {string} The path of the randomly chosen image.
     */
    chooseRandomlyFromFilteredImages(filteredImages) {
        if (filteredImages.length === 1) {
            return filteredImages[0];
        } else {
            return filteredImages[Math.floor(Math.random() * filteredImages.length)];
        }
    }

    /**
     * Plays the sound effect when the bottle is collected.
     */
    playCollectThrowableObjectSound() {
        this.collect_bottle_sound.currentTime = 0;
        if (!isMute) this.collect_bottle_sound.play();
    }
}
