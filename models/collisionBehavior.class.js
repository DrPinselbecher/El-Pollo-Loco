/**
 * Manages collision detection and handling within the game world.
 */
class CollisionHandlers {

    /**
     * Initializes the collision handlers with a reference to the game world.
     * @param {World} world - The game world instance.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Starts the collision detection intervals for enemies, throwable objects, and collectible items.
     */
    startCollisionChecks() {
        setInterval(() => this.filterEnemiesBasedOnCollision(), 16);
        setInterval(() => this.handleThrowableObjectsInteractionWithEndboss(), 100);
        setInterval(() => this.handleAllCollectionObjects(), 100);
    }

    /**
     * Handles collision checks for all collectible objects in the game.
     */
    handleAllCollectionObjects() {
        this.filterCoinsBasedOnCollision();
        this.filterThrowableObjectBasedOnCollision();
    }

    /**
     * Filters coins based on collision with the character and updates the game state accordingly.
     */
    filterCoinsBasedOnCollision() {
        world.level.coins = world.level.coins.filter((coin) => this.handleCoinCollection(coin));
    }

    /**
     * Determines if a coin has been collected based on collision.
     * @param {Coin} coin - The coin to check.
     * @returns {boolean} False if the coin is collected, true otherwise.
     */
    handleCoinCollection(coin) {
        if (this.isCoinCollected(coin)) {
            this.coinCollectedLogic(coin);
            return false;
        }
        return true;
    }

    /**
     * Logic to handle when a coin is collected.
     * @param {Coin} coin - The collected coin.
     */
    coinCollectedLogic(coin) {
        world.collectedCoins++;
        coin.playCollectCoinSound();
    }

    /**
     * Determines if a coin has been collected based on collision with the character.
     * @param {Coin} coin - The coin to check.
     * @returns {boolean} True if the coin is collected, false otherwise.
     */
    isCoinCollected(coin) {
        return world.character.isCollidingCoin(coin);
    }

    /**
     * Filters throwable objects based on collision with the character and updates the game state accordingly.
     */
    filterThrowableObjectBasedOnCollision() {
        world.level.throwableObject = world.level.throwableObject.filter((throwableObject) => this.handleThrowableObjectCollection(throwableObject));
    }

    /**
     * Determines if a throwable object has been collected based on collision.
     * @param {ThrowableObject} throwableObject - The throwable object to check.
     * @returns {boolean} False if the throwable object is collected, true otherwise.
     */
    handleThrowableObjectCollection(throwableObject) {
        if (world.character.isCollidingThrowableObject(throwableObject)) {
            this.throwableObjectCollectedLogic(throwableObject);
            return false;
        }
        return true;
    }

    /**
     * Logic to handle when a throwable object is collected.
     * @param {ThrowableObject} throwableObject - The collected throwable object.
     */
    throwableObjectCollectedLogic(throwableObject) {
        world.collectedThrowableObject++;
        throwableObject.playCollectThrowableObjectSound();
    }

    /**
     * Handles interaction between throwable objects and the endboss.
     */
    handleThrowableObjectsInteractionWithEndboss() {
        world.throwableObjects.forEach((object) => {
            world.level.endboss.forEach((boss) => this.processCollisionWithBoss(object, boss));
            this.cleanupSplashedObjects();
        });
    }

    /**
     * Processes collision between a throwable object and the endboss.
     * @param {ThrowableObject} object - The throwable object.
     * @param {Endboss} boss - The endboss.
     */
    processCollisionWithBoss(object, boss) {
        if (this.isCollidingThrowableObjectToEndboss(object, boss)) {
            this.processThrowableObjectSplash(object, boss);
        } else {
            this.processThrowableObjectMiss(object);
        }
    }

    /**
     * Handles the logic when a throwable object splashes.
     * @param {ThrowableObject} object - The splashed throwable object.
     * @param {Endboss} boss - The endboss affected by the splash.
     */
    processThrowableObjectSplash(object, boss) {
        !object.isSplashed ? object.processOfSplashThrowableObject(object) : this.processBossHitByThrowableObject(boss);
    }

    /**
     * Handles the logic for processing a hit on the boss by a throwable object.
     * @param {Endboss} boss - The boss being hit.
     */
    processBossHitByThrowableObject(boss) {
        if (!world.character.isDead()) {
            boss.hitBoss(throwDamage);
            world.statusBarEndboss.setPercentageOnBoss(boss.energyBoss);
        }
    }

    /**
     * Logic to handle when a throwable object misses its target.
     * @param {ThrowableObject} object - The missed throwable object.
     */
    processThrowableObjectMiss(object) {
        if (this.throwableObjectHitTheGround(object)) object.processOfSplashThrowableObject(object);
    }

    /**
     * Checks if a throwable object has hit the ground.
     * @param {ThrowableObject} object - The throwable object to check.
     * @returns {boolean} True if the object hit the ground, false otherwise.
     */
    throwableObjectHitTheGround(object) {
        return object.y > 750 && !object.isSplashed;
    }

    /**
     * Cleans up throwable objects that have splashed.
     */
    cleanupSplashedObjects() {
        world.throwableObjects = world.throwableObjects.filter(object => !object.isSplashed);
    }

    /**
     * Filters enemies based on collision with the character and updates the game state accordingly.
     */
    filterEnemiesBasedOnCollision() {
        world.level.enemies = world.level.enemies.filter(enemy => this.handleEnemyCollisionLogicWiithCharacter(enemy));
    }

    /**
     * Handles collision logic with the character for each enemy.
     * @param {MovableObject} enemy - The enemy to process collision with.
     * @returns {boolean} False if the enemy should be removed, true otherwise.
     */
    handleEnemyCollisionLogicWiithCharacter(enemy) {
        if (this.collisionWhileCharacterIsAlive(enemy)) this.evaluateEnemyCollisionOutcome(enemy);
        else if (this.isCharacterHighEnough()) world.isHighEnoughToHitEnemy = true;
        return this.isEnemyRemovable(enemy);
    }
    /**
     * Determines if an enemy is removable, based on whether its death animation is complete.
     * @param {MovableObject} enemy - The enemy to check.
     * @returns {boolean} True if the enemy can be removed, false otherwise.
     */
    isEnemyRemovable(enemy) {
        return !enemy.isDeadAnimationFromEnemyComplete;
    }

    /**
     * Evaluates the outcome of a collision between the character and an enemy.
     * @param {MovableObject} enemy - The enemy involved in the collision.
     */
    evaluateEnemyCollisionOutcome(enemy) {
        if (this.isHigherAndAboveTheEnemy(enemy)) this.processEnemyJumpCollision(enemy);
        else if (this.isCharacterVulnerableToEnemyAttack(enemy)) this.processEnemyHit(enemyDamage);
    }

    /**
     * Checks if the character's position is high enough to be considered above an enemy.
     * @returns {boolean} True if the character is high enough, false otherwise.
     */
    isCharacterHighEnough() {
        return world.character.y < 280;
    }

    /**
     * Determines if the character is vulnerable to an attack from an enemy.
     * @param {MovableObject} enemy - The enemy to consider.
     * @returns {boolean} True if the character is vulnerable, false otherwise.
     */
    isCharacterVulnerableToEnemyAttack(enemy) {
        return !world.character.ifAboveGround() || (world.character.y < enemy.y && !world.endbossIsDead);
    }

    /**
     * Checks if the character is above and higher than an enemy, which can affect collision outcomes.
     * @param {MovableObject} enemy - The enemy to compare with the character's position.
     * @returns {boolean} True if the character is higher and above the enemy, false otherwise.
     */
    isHigherAndAboveTheEnemy(enemy) {
        return world.character.ifAboveGround() && this.whetherHigherThanEnemy(enemy) && world.isHighEnoughToHitEnemy;
    }

    /**
     * Compares the vertical position of the character to the enemy to determine if the character is higher.
     * @param {MovableObject} enemy - The enemy to compare.
     * @returns {boolean} True if the character's vertical position is higher than the enemy's, false otherwise.
     */
    whetherHigherThanEnemy(enemy) {
        return (world.character.y + world.character.height) < (enemy.y + enemy.height);
    }

    /**
     * Checks if a collision is occurring while the character is alive and the enemy is not already dead.
     * @param {MovableObject} enemy - The enemy involved in the collision.
     * @returns {boolean} True if there is a collision and the character is alive, false otherwise.
     */
    collisionWhileCharacterIsAlive(enemy) {
        return world.character.isColliding(enemy) && enemy.currentActivityFromEnemy !== 'dead';
    }

    /**
     * Processes the collision outcome when the character jumps on an enemy.
     * @param {MovableObject} enemy - The enemy that was jumped on.
     */
    processEnemyJumpCollision(enemy) {
        world.character.miniJump();
        world.character.playCharacterMiniJumpSound();
        enemy.playEnemyHurtSound();
        world.character.playJumpingAnimation();
        this.setCurrentEnemyInDeadStatusForTheTimerToDespawn(enemy);
    }

    /**
     * Sets the current enemy status to dead for the timer to despawn.
     * @param {MovableObject} enemy - The enemy to set as dead.
     */
    setCurrentEnemyInDeadStatusForTheTimerToDespawn(enemy) {
        enemy.currentActivityFromEnemy = 'dead';
    }

    /**
     * Processes the outcome when an enemy hits the character.
     * @param {number} enemyDamage - The damage dealt by the enemy.
     */
    processEnemyHit(enemyDamage) {
        world.character.hit(enemyDamage);
        world.character.playCharacterHurtSound();
        world.statusBar.setPercentage(world.character.energy);
        world.isHighEnoughToHitEnemy = false;
    }

    /**
     * Checks if a throwable object is colliding with the endboss.
     * @param {ThrowableObject} obj - The throwable object.
     * @param {Endboss} boss - The endboss.
     * @returns {boolean} True if there is a collision, false otherwise.
     */
    isCollidingThrowableObjectToEndboss(obj, boss) {
        let additionalRange = -185;
        return obj.x < boss.x + boss.width + additionalRange &&
            obj.x + obj.width + additionalRange > boss.x &&
            obj.y < boss.y + boss.height &&
            obj.y + obj.height > boss.y;
    }
}