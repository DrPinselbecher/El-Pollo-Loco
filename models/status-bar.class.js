/**
 * Represents the status bar displaying the character's health.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {

    percentage = 100;
    IMAGES_CHARACTER_HEALTH_BAR = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    /**
     * Initializes the status bar with default settings and images for the health bar.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_CHARACTER_HEALTH_BAR);
        this.setPercentage(100);
        this.x = 40;
        this.y = 0;
        this.width = 440;
        this.height = 140;
    }

    /**
     * Sets the health percentage and updates the health bar image accordingly.
     * @param {number} percentage - The current health percentage.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_CHARACTER_HEALTH_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
}