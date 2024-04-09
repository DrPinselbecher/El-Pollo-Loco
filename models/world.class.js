/**
 * Represents the game world, containing all characters, items, and environmental objects.
 */
class World {

    character = new Character();
    statusBar = new StatusBar();
    statusBarEndboss = new StatusBarEndboss();
    coinObject = new CoinObject();
    throwableObjectToCollected = new BottleObject();
    collisionHandlers;
    throwableObjects = [];
    level = level1;
    collectedCoins = 0;
    collectedThrowableObject = 0;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    firstContactWithBoss = false;
    isHighEnoughToHitEnemy = false;

    throwCooldownRemaining = 0;
    timeOfTheLastThrow = 0;

    stopKeyActivity = false;
    endbossIsDead = false;

    background_sound = new Audio('audio/wind.mp3');

    /**
     * Initializes the game world with a canvas and keyboard inputs.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.collisionHandlers = new CollisionHandlers(this);
        this.collisionHandlers.startCollisionChecks();
        this.checkThrowObjectWhetherThrowable();
        this.drawAllElements();
        this.playBackgroundSound();
    }

    /**
     * Sets the current level for the game world.
     * @param {Level} newLevel - The new level to set.
     */
    setLevel(newLevel) {
        this.level = newLevel;
    }

    /**
     * Initializes the character and its animations in the world.
     */
    setWorld() {
        this.character.world = this;
        this.character.animate();
    }

    /**
     * Plays the background sound loop for the current level.
     */
    playBackgroundSound() {
        this.background_sound.loop = true;
        if (!isMute) this.background_sound.play();
    }

    /**
     * Triggers actions and visual feedback when the game is over.
     * @param {string} status - The game over status indicating win or loss.
     */
    gameIsOver(status) {
        this.stopAudios();
        showGameOverWindow(status);
    }

    /**
     * Stops all sounds in the world, signaling an end to key game activities.
     */
    stopAudios() {
        this.stopWorldBackgroundSound();
        this.character.stopCharacterWalkingSound();
        this.stopKeyActivity = true;
    }

    /**
     * Toggles the mute state for the game, affecting all sounds.
     */
    toggleMute() {
        if (!isMute) {
            this.muteSound();
            this.stopWorldBackgroundSound();
        } else if (isMute) {
            this.unMuteSound();
            this.playWorldBackgroundSoung();
        }
    }

    /**
     * Mutes the game sound.
     */
    muteSound() {
        isMute = true;
    }

    /**
     * Unmutes the game sound.
     */
    unMuteSound() {
        isMute = false;
    }

    /**
     * Resumes playing the background sound for the world.
     */
    playWorldBackgroundSoung() {
        this.background_sound.play();
    }

    /**
     * Stops the world's background sound and resets its play time.
     */
    stopWorldBackgroundSound() {
        this.background_sound.pause();
        this.background_sound.currentTime = 0;
    }

    /**
     * Sets up an interval to check and handle throwable object interactions.
     */
    checkThrowObjectWhetherThrowable() {
        setInterval(() => this.handleObjectThrowing(), 10);
    }

    /**
     * Handles the logic for throwing objects by the character.
     */
    handleObjectThrowing() {
        let now = Date.now();
        this.throwCooldownRemaining = Math.max(0, (this.timeOfTheLastThrow + throwCooldown) - now);
        if (this.canThrowObject(now)) this.handleThrowObject(now);
    }

    /**
     * Determines if the character can throw an object based on game conditions.
     * @param {number} now - The current timestamp.
     * @returns {boolean} True if the character can throw an object, false otherwise.
     */
    canThrowObject(now) {
        return this.keyboard.F && now - this.timeOfTheLastThrow >= throwCooldown && this.collectedThrowableObject > 0 && !this.character.isDead();
    }

    /**
     * Executes the throwing logic and updates the UI for collected throwable objects.
     * @param {number} now - The current timestamp.
     */
    handleThrowObject(now) {
        this.throwingLogic(now);
        this.drawCollectedThrowableObject();
    }

    /**
     * Creates and returns a new ThrowableObject instance based on the character's position and direction.
     * @returns {ThrowableObject} A new throwable object.
     */
    returnTheThrowableObject() {
        let throwableObject = new ThrowableObject(
            this.character.x + 50,
            this.character.y + 160,
            this.character.otherDirection ? 'left' : 'right'
        );

        return throwableObject;
    }

    /**
     * Handles the logic for throwing an object, including playing the throw sound, decrementing the throwable object count, and logging the time of the throw.
     * @param {number} now - The current timestamp.
     */
    throwingLogic(now) {
        this.returnTheThrowableObject().playThrowSound();
        this.collectedThrowableObject--;
        this.throwableObjects.push(this.returnTheThrowableObject());
        this.timeOfTheLastThrow = now;
    }

    /**
     * Main loop for drawing all game elements on the canvas, repeatedly called using requestAnimationFrame.
     */
    drawAllElements() {
        this.clearAndSetupCanvas();
        this.drawGameElements();
        this.drawUIElements();
        this.resetCanvasTranslation();
        requestAnimationFrame(() => this.drawAllElements());
    }

    /**
     * Draws the cooldown timer for throwable objects on the canvas.
     */
    drawThrowCooldown() {
        if (this.throwCooldownRemaining > 0) {
            let cooldownText = `${(this.throwCooldownRemaining / 1000).toFixed(1)}`;
            this.ctx.font = '60px Boogaloo';
            this.ctx.strokeStyle = 'black';
            this.ctx.fillStyle = 'red';
            this.drawTextWithBorder(cooldownText, 380, this.character.y + 160);
        }
    }

    /**
     * Draws the current level text on the canvas.
     */
    drawCurrentLevel() {
        let text = `${currentLevelText}`;
        let textWidth = this.ctx.measureText(text).width;
        let x = (this.canvas.width - textWidth - 45) / 2;
        this.ctx.font = '90px Boogaloo';
        this.ctx.fillStyle = 'white';
        this.drawTextWithBorder(text, x, 125);
    }

    /**
     * Helper method to draw text with a border for readability.
     * @param {string} text - The text to draw.
     * @param {number} x - The x-coordinate for the text.
     * @param {number} y - The y-coordinate for the text.
     */
    drawTextWithBorder(text, x, y) {
        this.ctx.lineWidth = 6;
        this.ctx.strokeText(text, x, y);
        this.ctx.fillText(text, x, y);
    }

    /**
     * Draws the number of collected coins on the canvas.
     */
    drawCollectedCoins() {
        let text = `${this.collectedCoins}`;
        this.ctx.font = '70px Boogaloo';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(text, 170, 217);
    }

    /**
     * Draws the number of collected throwable objects on the canvas.
     */
    drawCollectedThrowableObject() {
        let text = `${this.collectedThrowableObject}`;
        this.ctx.font = '70px Boogaloo';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(text, 382, 217);
    }

    /**
     * Clears the canvas and sets up the initial translation based on the camera position.
     */
    clearAndSetupCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Draws all dynamic game elements including background, NPCs, the character, and throwable objects.
     */
    drawGameElements() {
        this.drawBackgroundElements();
        this.drawCollectableElements();
        this.drawNPCs();
        this.drawTheCharacter();
        this.drawTheThrowableObject();
    }

    /**
     * Draws the player character.
     */
    drawTheCharacter() {
        this.addToMap(this.character);
    }

    /**
     * Draws all throwable objects.
     */
    drawTheThrowableObject() {
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Draws all NPCs and the endboss if present.
     */
    drawNPCs() {
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.endboss);
    }

    /**
     * Draws all background elements including static images and clouds.
     */
    drawBackgroundElements() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Draws all collectable items like coins and bottles.
     */
    drawCollectableElements() {
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.throwableObject);
    }

    /**
     * Draws UI elements that are fixed and not affected by the camera movement, such as the status bar and collected item counts.
     */
    drawUIElements() {
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        if (this.isBossBattleInitiated()) this.initiateBossBattleUI();
        this.drawCollectedObjectsFromTheCharacter();
        this.drawThrowCooldown();
        this.drawCurrentLevel();
        this.ctx.translate(this.camera_x, 0);
    }

    /**
     * Draws UI elements related to collected objects by the character.
     */
    drawCollectedObjectsFromTheCharacter() {
        this.addToMap(this.coinObject);
        this.addToMap(this.throwableObjectToCollected);
        this.drawCollectedCoins();
        this.drawCollectedThrowableObject();
    }

    /**
     * Initiates the UI for the boss battle, such as displaying the boss's health bar.
     */
    initiateBossBattleUI() {
        this.addToMap(this.statusBarEndboss);
        this.firstContactWithBoss = true;;
    }

    /**
     * Checks if the boss battle has been initiated.
     * @returns {boolean} True if the boss battle is initiated, false otherwise.
     */
    isBossBattleInitiated() {
        return this.character.x > this.level.endboss[0].x - 1000 || this.firstContactWithBoss;
    }

    /**
     * Resets canvas translation to its initial state.
     */
    resetCanvasTranslation() {
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Adds objects to the canvas based on the array of movable objects.
     * @param {MovableObject[]} object - An array of movable objects to draw.
     */
    addObjectsToMap(object) {
        object.forEach(o => this.addToMap(o));
    }

    /**
     * Adds a single movable object to the canvas, flipping the image if the object is facing the other direction.
     * @param {MovableObject} mo - The movable object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Applies a horizontal flip to the canvas context before drawing a movable object facing the opposite direction.
     * @param {MovableObject} mo - The movable object to be flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores the canvas context after drawing a flipped movable object, reversing the horizontal flip effect.
     * @param {MovableObject} mo - The movable object that was flipped.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}