/**
 * Represents a bottle icon for the game's UI, showing how many bottles the player has collected.
 * @extends DrawableObject
 */
class BottleObject extends DrawableObject {

    IMAGE_BOTTLE = [
        'img/7_statusbars/3_icons/icon_salsa_bottle.png'
    ];

    /**
     * Initializes a new bottle object with a specific image and position.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGE_BOTTLE);
        this.x = 280;
        this.y = 142;
        this.width = 125;
        this.height = 105;
    }
}