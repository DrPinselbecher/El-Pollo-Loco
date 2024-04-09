/**
 * Represents a cloud object that moves within the game's background, extending the functionality of a movable object.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    x = Math.random() * 1000;
    y = 100;
    width = 1000;
    height = 500;

    /**
     * Initializes a new Cloud object with a specific image and sets its initial position and animation behavior.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = 800 + Math.random() * 500;
        this.animate();
    }

    /**
     * Animates the cloud by moving it across the screen at a constant speed.
     */
    animate() {
        setInterval(() => this.x -= this.speed, 1000 / 60);
    }
}