/**
 * Represents an object within the game that can move and be affected by gravity.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 0.05;
    energy = 100;
    lastHit = 0;
    lastHitOnBoss = 0;

    currentActivityFromEnemy;
    currentViewDirectionFromEnemy;

    animationIndex = 0;

    otherDirection = false;
    isMiniJump = false;
    setRandomJumpTimer = false;
    isDeadAnimationFromEnemyComplete = false;
    animationInterval = null;
    walkEnemyAnimationInterval = null;


    /**
     * Applies gravity effect to the object.
     * @param {number} y - The ground level for gravity comparison.
     */
    applyGravity(y) {
        setInterval(() => this.applyGravityLogic(y), 1);
    }

    /**
     * Logic for applying gravity to the object.
     * @param {number} y - The ground level for gravity comparison.
     */
    applyGravityLogic(y) {
        if (this.ifAboveGround(y) || this.speedY > 0) {
            this.applyMovementAndAcceleration();
            this.handleMiniJump();
        }
    }

    /**
     * Applies movement and acceleration due to gravity.
     */
    applyMovementAndAcceleration() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
    }

    /**
     * Handles the logic for a mini jump, stopping the jump at a certain height.
     */
    handleMiniJump() {
        if (this.isMiniJump && this.y > 500) {
            this.y = 500;
            this.isMiniJump = false;
        }
    }

    /**
     * Checks if the object is above the ground.
     * @param {number} y - The ground level for comparison.
     * @returns {boolean} True if the object is above the ground, false otherwise.
     */
    ifAboveGround(y) {
        if (this instanceof ThrowableObject) {
            return true;
        } else if (this instanceof Character) {
            return this.y < 500;
        } else {
            return this.y < y
        }
    }

    /**
     * Checks for collision with a coin object.
     * @param {Coin} coin - The coin to check collision against.
     * @returns {boolean} True if colliding, false otherwise.
     */
    isCollidingCoin(coin) {
        let collisionOffsetRight = 145;
        let collisionOffsetLeft = 145;
        let rightOfLeftEdge = this.x + this.width - collisionOffsetRight > coin.x;
        let leftOfRightEdge = this.x + collisionOffsetLeft < coin.x + coin.width;
        let belowTopEdge = this.y + this.height > coin.y + 70;
        let aboveBottomEdge = this.y < coin.y + coin.height - 290;

        return rightOfLeftEdge && leftOfRightEdge && belowTopEdge && aboveBottomEdge;
    }

    /**
     * Checks for collision with a throwable object.
     * @param {ThrowableObject} throwableObject - The throwable object to check collision against.
     * @returns {boolean} True if colliding, false otherwise.
     */
    isCollidingThrowableObject(throwableObject) {
        let collisionOffsetRight = 140;
        let collisionOffsetLeft = 140;
        let collisionOffsetTop = 48;
        let collisionOffsetBottom = 48;
        let rightOfLeftEdge = this.x + this.width - collisionOffsetRight > throwableObject.x;
        let leftOfRightEdge = this.x + collisionOffsetLeft < throwableObject.x + throwableObject.width;
        let belowTopEdge = this.y + this.height - collisionOffsetBottom > throwableObject.y;
        let aboveBottomEdge = this.y + collisionOffsetTop < throwableObject.y + throwableObject.height;

        return rightOfLeftEdge && leftOfRightEdge && belowTopEdge && aboveBottomEdge;
    }

    /**
     * Checks for collision with another movable object.
     * @param {MovableObject} mo - The movable object to check collision against.
     * @returns {boolean} True if colliding, false otherwise.
     */
    isColliding(mo) {
        let collisionOffsetRight = 80;
        let collisionOffsetLeft = 80;
        let collisionOffsetBottom = 90;
        let rightOfLeftEdge = this.x + this.width - collisionOffsetRight > mo.x;
        let leftOfRightEdge = this.x + collisionOffsetLeft < mo.x + mo.width;
        let belowTopEdge = this.y + this.height - collisionOffsetBottom > mo.y;
        let aboveBottomEdge = this.y < mo.y + mo.height - collisionOffsetBottom;

        return rightOfLeftEdge && leftOfRightEdge && belowTopEdge && aboveBottomEdge;
    }

    /**
     * Initiates random movement for the object.
     */
    randomMovement() {
        if (this.enemyDead()) return;

        this.setActivityMovement();
        this.directionSystemToFlipImage();
        setTimeout(() => this.randomMovement(), this.calculateTimeToRandomMove());
    }

    /**
     * Determines the direction for flipping the object's image based on movement.
     */
    directionSystemToFlipImage() {
        if (this.enemyStands()) {
            this.randomViewDirection();
        } else {
            this.otherDirection = this.enemyGoRight();
        }
    }

    /**
     * Sets the movement activity randomly from available options.
     */
    setActivityMovement() {
        let activityOptions = ['left', 'right', 'idle'];
        this.currentActivityFromEnemy = activityOptions[Math.floor(Math.random() * activityOptions.length)];
    }

    /**
     * Randomizes the viewing direction of the object.
     */
    randomViewDirection() {
        this.setRandomViewDirection();
    }

    /**
     * Sets a random view direction for the object, either 'left' or 'right'.
     */
    setRandomViewDirection() {
        let viewDirectionOptions = ['left', 'right'];
        this.currentViewDirectionFromEnemy = viewDirectionOptions[Math.floor(Math.random() * viewDirectionOptions.length)];
        this.otherDirection = this.currentViewDirectionFromEnemy === 'right';
    }

    /**
     * Sets a random speed for the object.
     * @returns {number} The new speed of the object.
     */
    setRandomSpeed() {
        return this.speed = 0.4 + Math.random() * maxEnemySpeed;
    }

    /**
     * Randomizes the spawn location of the object.
     * @returns {number} The x-coordinate of the new spawn location.
     */
    setRandomSpawn() {
        return this.x = 800 + Math.random() * maxLevelLength;
    }

    /**
     * Initiates a random jump action.
     */
    randomJump() {
        if (this.enemyDead()) return;
        if (this.setRandomJumpTimer) this.jump();

        setTimeout(() => this.randomJump(), this.calculateTimeToRandomJump());
    }

    /**
     * Checks if the enemy is considered dead.
     * @returns {boolean} True if the enemy is dead, false otherwise.
     */
    enemyDead() {
        return this.currentActivityFromEnemy === 'dead';
    }

    /**
     * Determines if the enemy is moving to the right.
     * @returns {boolean} True if moving right, false otherwise.
     */
    enemyGoRight() {
        return this.currentActivityFromEnemy === 'right';
    }

    /**
     * Determines if the object's current activity indicates it is moving left.
     * @returns {boolean} True if the object is moving left, false otherwise.
     */
    enemyGoLeft() {
        return this.currentActivityFromEnemy === 'left';
    }

    /**
     * Checks if the object is currently in an idle state.
     * @returns {boolean} True if the object is idle, false otherwise.
     */
    enemyStands() {
        return this.currentActivityFromEnemy === 'idle';
    }

    /**
     * Calculates a random duration for initiating a jump action.
     * @returns {number} The calculated time in milliseconds to perform a jump.
     */
    calculateTimeToRandomJump() {
        this.setRandomJumpTimer = true;
        let duration1 = 500 + Math.random() * 2000;
        let duration2 = 200 + Math.random() * 1000;
        let timeToJump = duration1 + duration2;

        return timeToJump;
    }

    /**
     * Calculates a random duration for changing the object's view direction.
     * @returns {number} The calculated time in milliseconds to change view direction.
     */
    calculateTimeToRandomView() {
        let duration1 = 500 + Math.random() * 2000;
        let duration2 = 200 + Math.random() * 1000;
        let timeToView = duration1 + duration2;

        return timeToView;
    }

    /**
     * Calculates a random duration for initiating a move action.
     * @returns {number} The calculated time in milliseconds to perform a move.
     */
    calculateTimeToRandomMove() {
        let duration1 = 500 + Math.random() * 1000;
        let duration2 = 200 + Math.random() * 1000;
        let duration3 = 200 + Math.random() * 1000;
        let timeToMove = duration1 + duration2 + duration3;

        return timeToMove;
    }

    /**
     * Initiates the animation for an enemy's death and marks the animation as complete after a set time.
     * @param {string} deadImage - The path to the image to display when the enemy is dead.
     */
    playDeadEnemyAnimation(deadImage) {
        this.stopAllEnemyAnimations();
        this.img = this.imageCache[deadImage];
        setTimeout(() => this.isDeadAnimationFromEnemyComplete = true, 15000);
    }

    /**
     * Plays a dead animation for an object and triggers a game over status when the animation is complete.
     * @param {string[]} img - An array of image paths for the dead animation.
     * @param {number} intervalId - The ID of the interval to clear when the animation is complete.
     * @param {string} gameOverStatus - The game over status to set ('win' or 'lose').
     */
    playDeadAnimationWithGameOver(img, intervalId, gameOverStatus) {
        this.isSmallerThanDeadImages(img) ? this.updateToNextDeadImage(img) : this.setGameOver(intervalId, gameOverStatus);
    }

    /**
     * Updates the current image to the next one in the dead animation sequence.
     * @param {string[]} img - An array of image paths for the dead animation.
     */
    updateToNextDeadImage(img) {
        this.img = this.imageCache[img[this.animationIndex]];
        this.animationIndex++;
    }

    /**
     * Ends the game with a given status and clears the specified animation interval.
     * @param {number} intervalId - The interval to clear.
     * @param {string} gameOverStatus - The game over status ('win' or 'lose').
     */
    setGameOver(intervalId, gameOverStatus) {
        world.gameIsOver(gameOverStatus);
        clearInterval(intervalId);
        this.animationIndex = 0;
    }

    /**
     * Checks if the current animation index is smaller than the length of the dead images array.
     * @param {string[]} img - An array of image paths for the dead animation.
     * @returns {boolean} True if the current animation index is less than the length of the images array.
     */
    isSmallerThanDeadImages(img) {
        return this.animationIndex < img.length;
    }

    /**
     * Stops all ongoing enemy animations by clearing their intervals.
     */
    stopAllEnemyAnimations() {
        clearInterval(this.walkEnemyAnimationInterval);
        clearInterval(this.animationInterval);
    }

    /**
     * Stops the walking animation of an enemy by clearing the interval.
     * @returns {boolean} Always returns false.
     */
    stopWalkEnemyAnimation() {
        clearInterval(this.walkEnemyAnimationInterval);
        this.walkEnemyAnimationInterval = null;
        return false;
    }

    /**
     * Sets the enemy to move left by starting the walk animation and adjusting its position.
     */
    setGoLeftMovementOnTheEnemy() {
        this.playWalkAnimation();
        this.moveLeft();
    }

    /**
     * Sets the enemy to move right by starting the walk animation and adjusting its position.
     */
    setGoRightMovementOnTheEnemy() {
        this.playWalkAnimation();
        this.moveRight();
    }

    /**
     * Sets the enemy to stand still by stopping the walk animation and loading a specific image.
     * @param {string} img - The path to the image to display for the standing enemy.
     */
    setStandsMovementOnTheEnemy(path) {
        this.stopWalkEnemyAnimation();
        this.img = this.imageCache[path];
    }

    /**
     * Applies damage to the object, reducing its energy, unless it's currently in a hurt state.
     * @param {number} damage - The amount of damage to apply.
     */
    hit(damage) {
        if (!this.isHurt()) this.reducesLife(damage);
    }

    /**
     * Reduces the object's energy by a specified amount of damage and records the time of the last hit.
     * @param {number} damage - The amount of damage to reduce from the object's energy.
     */
    reducesLife(damage) {
        this.energy -= damage;
        if (this.energy < 0) this.energy = 0;
        this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the object is currently in a hurt state based on the time since the last hit.
     * @returns {boolean} True if the object is currently hurt, false otherwise.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        return timePassed < 600;
    }

    /**
     * Checks if the object is dead, based on its energy level.
     * @returns {boolean} True if the object's energy is 0, indicating it is dead.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Moves the object to the left by decreasing its x-coordinate by the object's speed.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Moves the object to the right by increasing its x-coordinate by the object's speed.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Causes the object to jump by setting its vertical speed.
     */
    jump() {
        this.speedY = 5;
    }

    /**
     * Initiates a mini jump for the object, setting a flag and adjusting its vertical speed.
     */
    miniJump() {
        this.isMiniJump = true;
        this.speedY = 3;
    }
}