/**
 * Represents a smaller chicken enemy in the game, inheriting behaviors and properties from MovableObject.
 * @extends MovableObject
 */
class Chick extends MovableObject {
    y = 830;
    height = 120;
    width = 120;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';
    IMAGE_STANDING = 'img/3_enemies_chicken/chicken_small/1_walk/2_w.png';

    enemy_hurt_sound = new Audio('audio/chickDamaged.mp3');

    /**
     * Constructs a new Chick object with predefined properties and initiates its animations and behaviors.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadAndCacheImage(this.IMAGE_DEAD);
        this.loadAndCacheImage(this.IMAGE_STANDING);

        this.setRandomSpawn();
        this.setRandomSpeed();
        this.randomMovement();
        this.randomJump();
        this.applyGravity(this.y);
        this.animate();
    }

    /**
     * Sets up the animation logic for the Chick object, allowing it to perform actions based on its state.
     */
    animate() {
        this.animationInterval = setInterval(() => this.animateLogic(), 1000 / 60);
    }

    /**
     * Defines the logic for chick's animation based on its movement and actions.
     */
    animateLogic() {
        if (this.enemyGoLeft()) {
            this.setGoLeftMovementOnTheEnemy();
        } else if (this.enemyGoRight()) {
            this.setGoRightMovementOnTheEnemy();
        } else if (this.enemyStands()) {
            this.setStandsMovementOnTheEnemy(this.IMAGE_STANDING);
        } else if (this.enemyDead()) {
            this.playDeadEnemyAnimation(this.IMAGE_DEAD);
        }
    }

    /**
     * Initiates the walking animation for the chick.
     */
    playWalkAnimation() {
        if (!this.walkEnemyAnimationInterval) {
            this.walkEnemyAnimationInterval = setInterval(() => this.playAnimation(this.IMAGES_WALKING), 160);
        }
    }

    /**
     * Plays the sound effect when the chick is hurt.
     */
    playEnemyHurtSound() {
        this.enemy_hurt_sound.currentTime = 0;
        if (!isMute) this.enemy_hurt_sound.play();
    }
}
