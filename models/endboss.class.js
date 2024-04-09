/**
 * Represents the end boss in the game, inheriting properties and methods from MovableObject.
 * @extends MovableObject
 */
class Endboss extends MovableObject {

    height = 1100;
    width = 800;
    speed;
    bossDamage;
    y = -70;
    x;

    energyBoss = 100;
    initIntro = false;
    unstoppebleIntro = false;
    goLeft = false;
    introIndex = 0;

    deadAnimationStarted = false;
    startCheckMovementIntervalId = null;
    bossDeadAnimationIntervalId = null;

    IMAGES_ENDBOSS_CHICKEN_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ENDBOSS_CHICKEN_WALK = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ENDBOSS_CHICKEN_ATTAK = [
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png'
    ];

    IMAGES_ENDBOSS_CHICKEN_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    dead_sound = new Audio('audio/bossChickenDead.mp3');

    /**
    * Constructs an Endboss with specific position, damage, and speed attributes.
    * @param {number} x - The initial x-coordinate of the end boss.
    * @param {number} damage - The damage the end boss deals.
    * @param {number} speed - The movement speed of the end boss.
    */
    constructor(x, damage, speed) {
        super();
        this.loadImages(this.IMAGES_ENDBOSS_CHICKEN_ALERT);
        this.loadImages(this.IMAGES_ENDBOSS_CHICKEN_WALK);
        this.loadImages(this.IMAGES_ENDBOSS_CHICKEN_ATTAK);
        this.loadImages(this.IMAGES_ENDBOSS_CHICKEN_DEAD);
        this.x = x;
        this.speed = speed;
        this.bossDamage = damage;
        this.intro = false;
        this.animate();
    }

    /**
     * Initiates the end boss's animations and intro sequence.
     */
    animate() {
        this.playAnimationWithEnd(this.IMAGES_ENDBOSS_CHICKEN_ALERT);
        this.startBossIntro();
    }

    /**
     * Starts the introductory animation for the end boss.
     */
    startBossIntro() {
        this.intro = setInterval(() => this.manageIntroConditions(), 250);
    }

    /**
     * Manages conditions to run the intro animation.
     */
    manageIntroConditions() {
        if (this.shouldStartIntro()) this.runIntroAnimation()
    }

    /**
     * Determines whether the intro animation should start based on the character's position and other conditions.
     * @returns {boolean} True if the intro should start, false otherwise.
     */
    shouldStartIntro() {
        return world && world.character.x > this.x - 1000 && !this.initIntro || this.unstoppebleIntro;
    }

    /**
     * Runs the intro animation sequence or finishes the intro based on conditions.
     */
    runIntroAnimation() {
        this.isIntroAnimationRunning() ? this.playIntroAnimation() : this.finishIntro();
    }

    /**
     * Checks if the intro animation is still running.
     * @returns {boolean} True if the intro animation is running, false otherwise.
     */
    isIntroAnimationRunning() {
        return this.introIndex < 6;
    }

    /**
     * Plays the intro animation sequence.
     */
    playIntroAnimation() {
        this.playAnimationWithEnd(this.IMAGES_ENDBOSS_CHICKEN_ALERT);
        this.introIndex++;
        this.unstoppebleIntro = true;
    }

    /**
     * Finalizes the intro sequence and starts the boss's movement.
     */
    finishIntro() {
        this.startBossMovement();
        this.initIntro = true;
        this.unstoppebleIntro = false;
        this.introIndex = 0;
    }

    /**
     * Initiates the end boss's movement and attack patterns.
     */
    startBossMovement() {
        clearInterval(this.intro);
        this.startCheckMovementIntervalId = setInterval(() => this.bossMovement(), 190);
        setInterval(() => this.checkIfBossDead(), 10);
    }

    /**
     * Controls the end boss's movement towards the character and initiates attacks.
     */
    bossMovement() {
        this.bossIsOutOfCharacter() && !this.bossIsDead() ? this.bossGoToCharacter() : this.stopBossWalkAndAttack();
        this.stopBossMovementIfCharacterOrBossDead();
    }

    /**
     * Stops the boss's walking and attack movements.
     */
    stopBossWalkAndAttack() {
        this.stopBossMovingToLeft();
        this.attackCharacter();
    }

    /**
     * Stops the boss's movement if either the character or the boss is dead.
     */
    stopBossMovementIfCharacterOrBossDead() {
        if (world.character.isDead() || this.isEndbossDead()) this.clearBossMovement();
    }

    /**
     * Clears any ongoing movement intervals for the boss.
     */
    clearBossMovement() {
        clearInterval(this.startCheckMovementIntervalId);
        clearInterval(this.goLeft);
    }

    /**
     * Initiates an attack on the character by the boss.
     */
    attackCharacter() {
        if (this.isEndbossDead()) return;
        this.playAnimation(this.IMAGES_ENDBOSS_CHICKEN_ATTAK);
        setTimeout(() => this.hitCharacterNow(), 180);
    }

    /**
     * Hits the character, applying damage and triggering related effects.
     */
    hitCharacterNow() {
        world.character.hit(this.bossDamage);
        world.statusBar.setPercentage(world.character.energy);
        world.character.playCharacterHurtSound();
    }

    /**
     * Stops the boss from moving to the left.
     */
    stopBossMovingToLeft() {
        clearInterval(this.goLeft);
        this.goLeft = null;
    }

    /**
     * Directs the boss to move towards the character.
     */
    bossGoToCharacter() {
        if (!this.goLeft) this.startMovingLeft();
        this.playAnimation(this.IMAGES_ENDBOSS_CHICKEN_WALK);
    }

    /**
     * Checks if the boss is positioned to the left of the character.
     * @returns {boolean} True if the boss is to the left of the character, false otherwise.
     */
    bossIsOutOfCharacter() {
        return world.character.x < this.x;
    }

    /**
     * Starts the boss's movement towards the left.
     */
    startMovingLeft() {
        if (this.goLeft) clearInterval(this.goLeft);
        this.goLeft = setInterval(() => this.moveLeft(), 1000 / 60);
    }

    /**
     * Checks if the boss is dead and if its death animation should start.
     */
    checkIfBossDead() {
        if (this.bossDeadAndDontStartDeadAnimation()) this.bossDeadAnimation();
    }

    /**
     * Determines if the boss is dead and its death animation hasn't started yet.
     * @returns {boolean} True if the boss is dead and the death animation hasn't started, false otherwise.
     */
    bossDeadAndDontStartDeadAnimation() {
        return this.bossIsDead() && !this.deadAnimationStarted;
    }

    /**
     * Initiates the boss's death animation sequence.
     */
    bossDeadAnimation() {
        clearInterval(this.goLeft);
        this.deadBossAnimation();
        this.deadAnimationStarted = true;
        clearInterval(this.startCheckMovementIntervalId);
    }

    /**
     * Plays the boss's death animation.
     */
    deadBossAnimation() {
        if (!isMute) this.playBossDeadSound();
        this.bossDeadAnimationIntervalId = setInterval(() => this.playDeadAnimationWithGameOver(this.IMAGES_ENDBOSS_CHICKEN_DEAD, this.bossDeadAnimationIntervalId, 'win'), 130);
    }

    /**
     * Plays the sound effect for the boss's death.
     */
    playBossDeadSound() {
        this.dead_sound.currentTime = 0;
        this.dead_sound.play();
    }

    /**
     * Checks if the boss is dead.
     * @returns {boolean} True if the boss's energy is zero, indicating it is dead, false otherwise.
     */
    bossIsDead() {
        return this.energyBoss == 0;
    }

    /**
     * Applies damage to the boss.
     * @param {number} damage - The amount of damage to apply to the boss.
     */
    hitBoss(damage) {
        this.energyBoss -= damage;
        if (this.energyBoss < 0) {
            this.energyBoss = 0;
        } else {
            this.lastHitOnBoss = new Date().getTime();
        }
    }

    /**
     * Checks if the boss is currently in a hurt state based on the last time it was hit.
     * @returns {boolean} True if the boss was recently hit, false otherwise.
     */
    bossIsHurt() {
        let timepassed = new Date().getTime() - this.lastHitOnBoss;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Determines if the end boss is dead, affecting the game state accordingly.
     * @returns {boolean} True if the boss's energy is zero, false otherwise.
     */
    isEndbossDead() {
        world.endbossIsDead = true;
        return this.energyBoss == 0;
    }
}