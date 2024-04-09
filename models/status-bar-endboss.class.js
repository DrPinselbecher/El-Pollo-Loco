/**
 * Represents the status bar displaying the end boss's health.
 * @extends DrawableObject
 */
class StatusBarEndboss extends DrawableObject {

    percentage = 100;
    IMAGES_ENDBOSS_HEALTH_BAR = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png',
    ];

    /**
     * Initializes the status bar for the end boss with default settings and images for the health bar.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSS_HEALTH_BAR);
        this.setPercentageOnBoss(100);
        this.x = 1420;
        this.y = 20;
        this.width = 440;
        this.height = 140;
    }

    /**
     * Sets the health percentage of the end boss and updates the health bar image accordingly.
     * @param {number} percentage - The current health percentage of the end boss.
     */
    setPercentageOnBoss(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_ENDBOSS_HEALTH_BAR[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
}