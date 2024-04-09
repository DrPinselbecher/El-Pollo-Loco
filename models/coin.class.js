/**
 * Represents a collectible coin in the game that can shine and produce sound upon collection.
 * @extends DrawableObject
 */
class Coin extends DrawableObject {
    width = 240;
    height = 240;

    IMAGES_SHINE_COIN = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    collect_coin_sound = new Audio('audio/collectCoin.mp3');

    /**
     * Initializes a new Coin object at a specific position with animation and sound.
     * @param {number} x - The x-coordinate of the coin.
     * @param {number} y - The y-coordinate of the coin.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_SHINE_COIN);

        this.animate();
    }

    /**
     * Initiates the animation that makes the coin shine.
     */
    animate() {
        setInterval(() => this.playAnimation(this.IMAGES_SHINE_COIN), 750);
    }

    /**
     * Plays the sound effect when the coin is collected.
     */
    playCollectCoinSound() {
        this.collect_coin_sound.currentTime = 0;
        if (!isMute) this.collect_coin_sound.play();
    }
}
