/**
 * Represents the main character of the game, handling its movement, animations, and interactions.
 * @extends MovableObject
 */
class Character extends MovableObject {

    height = 460;
    width = 235;
    speed = 7;
    spawnPoint = 220;
    x = 220;
    world;

    restartAnimationOnNextFrame = true;
    idleIntervalId = null;
    deadIntervalId = null;
    jumpIntervalId = null;
    hurtIntervalId = null;
    walkingIntervalId = null;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    walking_sound = new Audio('audio/walkCharacter.mp3');
    jumping_sound = new Audio('audio/jumpCharacter.mp3');
    hurt_sound = new Audio('audio/characterHurt.mp3');

    /**
     * Constructs a new Character with initial settings, loading necessary images for various states (idle, walking, jumping, hurt, dead).
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.applyGravity(this.y);
    }

    /**
     * Initiates the character's movement and animation checks.
     */
    animate() {
        setInterval(() => this.characterMovement(), 1000 / 60);
        setInterval(() => this.checkActivityForAnimations(), 1000 / 60);
        setInterval(() => this.cameraPosition(), 1000 / 60);
    }

    /**
     * Handles the character's movements including left, right, and jump actions based on input.
     */
    characterMovement() {
        this.characterLeftMovement();
        this.characterRightMovement();
        this.characterJumpMovement();
        this.characterInactiveMovement();
    }

    /**
     * Executes the jump movement of the character if the jump condition is met.
     */
    characterJumpMovement() {
        if (this.characterJump()) this.playCharacterJumpMovement();
    }

    /**
     * Stops character's walking sound when inactive or when moving in both directions simultaneously.
     */
    characterInactiveMovement() {
        if (!this.characterMoveRight() && !this.characterMoveLeft() || this.characterMoveRightAndLeft()) {
            this.stopCharacterWalkingSound()
        }
    }

    /**
     * Plays the character's movement to the right, adjusting animation and sound.
     */
    characterRightMovement() {
        if (this.characterMoveRight() && !this.characterMoveLeft()) this.playCharacterRightMovement();
    }

    /**
     * Plays the character's movement to the left, adjusting animation and sound.
     */
    characterLeftMovement() {
        if (this.characterMoveLeft() && !this.characterMoveRight()) this.playCharacterLeftMovement();
    }

    /**
     * Checks the character's current activity state to determine the appropriate animations to play.
     */
    checkActivityForAnimations() {
        if (this.isDead()) {
            this.characterIsDead();
        } else if (this.isHurt()) {
            this.characterIsHit();
        } else if (this.ifAboveGround()) {
            this.characterIsJumping();
        } else if (this.characterGoes()) {
            this.characterIsGoing();
        } else {
            this.characterIsInactive();
        }
    }

    /**
     * Adjusts the camera position based on the character's position and spawn point.
     * @returns {number} The updated camera x-coordinate.
     */
    cameraPosition() {
        return this.world.camera_x = -this.x + this.spawnPoint;
    }

    /**
     * Plays the walking sound if conditions are met, otherwise stops the walking sound.
     */
    playCharacterWalkingSound() {
        this.canPlaySound() && !this.ifAboveGround() ? this.walking_sound.play() : this.stopCharacterWalkingSound();
    }

    /**
     * Stops the character's walking sound and resets its playtime.
     */
    stopCharacterWalkingSound() {
        this.walking_sound.pause();
        this.walking_sound.currentTime = 0;
    }

    /**
     * Plays the character's jumping sound if sound is enabled.
     */
    playCharacterJumpSound() {
        if (this.canPlaySound()) this.jumping_sound.play();
    }

    /**
     * Plays the character's mini jump sound if sound is enabled.
     */
    playCharacterMiniJumpSound() {
        this.jumping_sound.currentTime = 0;
        if (!isMute) this.jumping_sound.play();
    }

    /**
     * Plays the character's hurt sound if sound is enabled.
     */
    playCharacterHurtSound() {
        if (!isMute) this.hurt_sound.play();
    }

    /**
     * Initiates the character's movement to the right, including moving and playing walking sound.
     */
    playCharacterRightMovement() {
        this.otherDirection = false;
        this.moveRight();
        this.playCharacterWalkingSound();
    }

    /**
     * Initiates the character's movement to the left, including moving and playing walking sound.
     */
    playCharacterLeftMovement() {
        this.otherDirection = true;
        this.moveLeft();
        this.playCharacterWalkingSound();
    }

    /**
     * Executes the character's jump movement and sound.
     */
    playCharacterJumpMovement() {
        this.jump();
        this.playCharacterJumpSound();
        this.restartAnimationOnNextFrame = true;
        this.stopCharacterWalkingSound();
    }

    /**
     * Checks if the character can move right based on keyboard input and game conditions.
     * @returns {boolean} True if the character can move right, false otherwise.
     */
    characterMoveRight() {
        return this.world.keyboard.RIGHT && this.canCharacterMoveRight() && !this.isDead();
    }

    /**
     * Determines if the character can move right within the game world boundaries.
     * @returns {boolean} True if the character can move right, false otherwise.
     */
    canCharacterMoveRight() {
        return this.x < this.world.level.level_end_x;
    }

    /**
     * Checks if the character can move left based on keyboard input and game conditions.
     * @returns {boolean} True if the character can move left, false otherwise.
     */
    characterMoveLeft() {
        return this.world.keyboard.LEFT && this.canCharacterMoveLeft() && !this.isDead();
    }

    /**
     * Determines if the character is moving both right and left simultaneously.
     * @returns {boolean} True if moving in both directions, false if not.
     */
    characterMoveRightAndLeft() {
        return this.characterMoveRight() && this.characterMoveLeft();
    }

    /**
     * Determines if the character can move left within the game world boundaries.
     * @returns {boolean} True if the character can move left, false otherwise.
     */
    canCharacterMoveLeft() {
        return this.x > 3980 - this.world.level.level_end_x + this.spawnPoint;
    }

    /**
     * Checks if the character is performing a jump action based on keyboard input and conditions.
     * @returns {boolean} True if the character is jumping, false otherwise.
     */
    characterJump() {
        return (this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.ifAboveGround() && !this.isDead();
    }

    /**
     * Determines if the character is moving either to the left or right.
     * @returns {boolean} True if the character is moving in any horizontal direction, false otherwise.
     */
    characterGoes() {
        return this.world.keyboard.RIGHT && !this.characterMoveRightAndLeft() || this.world.keyboard.LEFT && !this.characterMoveRightAndLeft();
    }

    /**
     * Executes logic when the character is dead, including clearing relevant intervals and playing the death animation.
     */
    characterIsDead() {
        this.clearIntervalsExcept('dead');
        this.characterDeadAnimation();
    }

    /**
     * Executes logic when the character is hit, including clearing relevant intervals and playing the hurt animation.
     */
    characterIsHit() {
        this.clearIntervalsExcept('hurt');
        this.playHurtAnimation();
    }

    /**
     * Executes logic when the character is jumping, including clearing relevant intervals and playing the jumping animation.
     */
    characterIsJumping() {
        this.clearIntervalsExcept('jump');
        this.playJumpingAnimation();
    }

    /**
     * Executes logic when the character is moving, including clearing relevant intervals and playing the walking animation.
     */
    characterIsGoing() {
        this.clearIntervalsExcept('walk');
        this.playWalkingAnimation();
    }

    /**
     * Executes logic when the character is inactive, including clearing relevant intervals and playing the idle animation.
     */
    characterIsInactive() {
        this.clearIntervalsExcept('idle');
        this.playIdleAnimation();
    }

    /**
     * Determines if the 'idle' interval should not be cleared based on the current action.
     * @param {string} except - The current action being executed.
     * @returns {boolean} True if the 'idle' interval should remain, false otherwise.
     */
    isntIdle(except) {
        return except !== 'idle' && this.idleIntervalId !== null;
    }

    /**
     * Determines if the 'dead' interval should not be cleared based on the current action.
     * @param {string} except - The current action being executed.
     * @returns {boolean} True if the 'dead' interval should remain, false otherwise.
     */
    isntDead(except) {
        return except !== 'dead' && this.deadIntervalId !== null;
    }

    /**
     * Determines if the 'jump' interval should not be cleared based on the current action.
     * @param {string} except - The current action being executed.
     * @returns {boolean} True if the 'jump' interval should remain, false otherwise.
     */
    isntJump(except) {
        return except !== 'jump' && this.jumpIntervalId !== null;
    }

    /**
     * Determines if the 'walk' interval should not be cleared based on the current action.
     * @param {string} except - The current action being executed.
     * @returns {boolean} True if the 'walk' interval should remain, false otherwise.
     */
    isntWalk(except) {
        return except !== 'walk' && this.walkingIntervalId !== null;
    }

    /**
     * Determines if the 'hurt' interval should not be cleared based on the current action.
     * @param {string} except - The current action being executed.
     * @returns {boolean} True if the 'hurt' interval should remain, false otherwise.
     */
    isntHurt(except) {
        return except !== 'hurt' && this.hurtIntervalId !== null;
    }

    /**
     * Clears the 'idle' animation interval and resets the interval ID.
     */
    clearIdleInterval() {
        clearInterval(this.idleIntervalId);
        this.idleIntervalId = null;
    }

    /**
     * Clears the 'dead' animation interval and resets the interval ID.
     */
    clearDeadInterval() {
        clearInterval(this.deadIntervalId);
        this.deadIntervalId = null;
    }

    /**
     * Clears the 'jump' animation interval and resets the interval ID.
     */
    clearJumpInterval() {
        clearInterval(this.jumpIntervalId);
        this.jumpIntervalId = null;
    }

    /**
     * Clears the 'walk' animation interval and resets the interval ID.
     */
    clearWalkInterval() {
        clearInterval(this.walkingIntervalId);
        this.walkingIntervalId = null;
    }

    /**
     * Clears the 'hurt' animation interval and resets the interval ID.
     */
    clearHurtInterval() {
        clearInterval(this.hurtIntervalId);
        this.hurtIntervalId = null;
    }

    /**
     * Clears animation intervals except for the specified action.
     * @param {string} except - The action for which the interval should not be cleared.
     */
    clearIntervalsExcept(except) {
        if (this.isntIdle(except)) this.clearIdleInterval();
        if (this.isntDead(except)) this.clearDeadInterval();
        if (this.isntJump(except)) this.clearJumpInterval();
        if (this.isntWalk(except)) this.clearWalkInterval();
        if (this.isntHurt(except)) this.clearHurtInterval();
    }

    /**
     * Initiates the death animation sequence for the character.
     */
    characterDeadAnimation() {
        if (this.deadIntervalId === null) {
            this.deadIntervalId = setInterval(() => this.playDeadAnimationWithGameOver(this.IMAGES_DEAD, this.deadIntervalId, 'lose'), 120);
        }
    }

    /**
     * Initiates the hurt animation sequence for the character.
     */
    playHurtAnimation() {
        if (this.hurtIntervalId === null) this.characterHurtAnimation();
    }

    /**
     * Sets an interval for the hurt animation of the character.
     */
    characterHurtAnimation() {
        return this.hurtIntervalId = setInterval(() => this.playAnimation(this.IMAGES_HURT), 115);
    }

    /**
     * Initiates the jumping animation sequence for the character.
     */
    playJumpingAnimation() {
        if (this.jumpIntervalId === null) this.characterJumpAnimation();
    }

    /**
     * Sets an interval for the jumping animation of the character.
     */
    characterJumpAnimation() {
        return this.jumpIntervalId = setInterval(() => this.playAnimationWithEnd(this.IMAGES_JUMPING), 30);
    }

    /**
     * Initiates the walking animation sequence for the character.
     */
    playWalkingAnimation() {
        if (this.walkingIntervalId === null) this.characterWalkAnimation();
    }

    /**
     * Sets an interval for the walking animation of the character.
     */
    characterWalkAnimation() {
        return this.walkingIntervalId = setInterval(() => this.playAnimation(this.IMAGES_WALKING), 100);
    }

    /**
     * Initiates the idle animation sequence for the character.
     */
    playIdleAnimation() {
        if (this.idleIntervalId === null) this.characterIdleAnimation();
    }

    /**
     * Sets an interval for the idle animation of the character.
     */
    characterIdleAnimation() {
        this.playAnimation(this.IMAGES_IDLE);
        this.idleIntervalId = setInterval(() => this.playAnimation(this.IMAGES_IDLE), 230);
    }
}