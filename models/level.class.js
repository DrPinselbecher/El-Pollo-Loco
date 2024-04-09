/**
 * Represents a game level, containing all entities and objects within it.
 */
class Level {

    /**
     * Constructs a new Level with specified entities and objects.
     * @param {BackgroundObject[]} backgroundObjects - Array of background objects in the level.
     * @param {Cloud[]} clouds - Array of clouds in the level.
     * @param {MovableObject[]} enemies - Array of enemies in the level.
     * @param {Endboss} endboss - The end boss of the level.
     * @param {Coin[]} coins - Array of coins in the level.
     * @param {Bottle[]} throwableObject - Array of throwable objects in the level.
     */
    constructor(backgroundObjects, clouds, enemies, endboss, coins, throwableObject) {
        this.backgroundObjects = backgroundObjects;
        this.clouds = clouds;
        this.enemies = enemies;
        this.endboss = endboss;
        this.level_end_x = maxLevelLength;
        this.coins = coins.map(() => new Coin(this.setRandomX(), this.setRandomY()));
        this.throwableObject = throwableObject.map(() => new Bottle(this.setRandomX(), 830));
    }

    /**
     * Generates a random X position within the level boundaries.
     * @returns {number} The randomly generated X position.
     */
    setRandomX() {
        return 500 + Math.random() * (maxLevelLength - 300);
    }

    /**
     * Generates a random Y position within a specified range.
     * @returns {number} The randomly generated Y position.
     */
    setRandomY() {
        return 300 + Math.random() * 400;
    }
}
