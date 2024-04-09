/**
 * Represents a coin icon for the game's UI, showing how many coins the player has collected.
 * @extends DrawableObject
 */
class CoinObject extends DrawableObject {

    IMAGE_COIN = [
        'img/7_statusbars/3_icons/icon_coin.png'
    ];

    /**
     * Initializes a new coin object with a specific image and position.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGE_COIN);
        this.x = 40;
        this.y = 120;
        this.width = 130;
        this.height = 130;
    }
}