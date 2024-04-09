/**
 * Represents a chicken enemy in the game, inheriting from MovableObject.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    y = 830;
    height = 120;
    width = 90;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
    IMAGE_STANDING = 'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png';

    enemy_hurt_sound = new Audio('audio/chickenDamaged.mp3');

    /**
     * Initializes a new instance of the Chicken class.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadAndCacheImage(this.IMAGE_DEAD);
        this.loadAndCacheImage(this.IMAGE_STANDING);

        this.setRandomSpawn();
        this.setRandomSpeed();
        this.randomMovement();
        this.animate();
    }

    /**
     * Starts the animation logic for the chicken movement.
     */
    animate() {
        this.animationInterval = setInterval(() => this.animateLogic(), 1000 / 60);
    }

    /**
     * Determines the chicken's behavior based on its current state and performs actions accordingly.
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
     * Initiates the walking animation for the chicken.
     */
    playWalkAnimation() {
        if (!this.walkEnemyAnimationInterval) {
            this.walkEnemyAnimationInterval = setInterval(() => this.playAnimation(this.IMAGES_WALKING), 160);
        }
    }

    /**
     * Plays the sound effect when the chicken is hurt.
     */
    playEnemyHurtSound() {
        this.enemy_hurt_sound.currentTime = 0;
        if (!isMute) this.enemy_hurt_sound.play();
    }
}
