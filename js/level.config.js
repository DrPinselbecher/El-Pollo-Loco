/**
 * Creates background objects for the game level, spaced out based on a multiplier.
 * @param {number} multiplier - Determines the number and spacing of background objects.
 * @returns {BackgroundObject[]} An array of BackgroundObject instances.
 */
function createBackgroundObjects(multiplier) {
    let backgroundObjects = [];
    for (let i = -1; i <= multiplier; i++) {
        let layer1or2 = (i % 2 === 0) ? '2' : '1';
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/air.png`, 1919 * i));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${layer1or2}.png`, 1919 * i));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${layer1or2}.png`, 1919 * i));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${layer1or2}.png`, 1919 * i));
    }
    return backgroundObjects;
}


/**
 * Generates a list of enemy objects for the game level.
 * @param {number} count1 - The number of Chicken enemies to create.
 * @param {number} count2 - The number of Chick enemies to create.
 * @returns {MovableObject[]} An array of enemy objects.
 */
function createEnemies(count1, count2) {
    let enemies = [];
    for (let i = 0; i < count1; i++) {
        enemies.push(new Chicken());
    }
    for (let i = 0; i < count2; i++) {
        enemies.push(new Chick());
    }
    return enemies;
}

/**
 * Creates a specified number of coin objects to be collected in the game level.
 * @param {number} count - The number of Coin objects to create.
 * @returns {Coin[]} An array of Coin objects.
 */
function createCoins(count) {
    let coins = [];
    for (let i = 0; i < count; i++) {
        coins.push(new Coin());
    }
    return coins;
}

/**
 * Creates throwable objects for the player to use in the game level.
 * @param {number} count - The number of ThrowableObject instances to create.
 * @returns {ThrowableObject[]} An array of ThrowableObject instances.
 */
function createThrowableObjects(count) {
    let throwableObjects = [];
    for (let i = 0; i < count; i++) {
        throwableObjects.push(new Bottle());
    }
    return throwableObjects;
}

/**
 * Checks and initializes the current game level based on the world's state.
 */
function checkCurrentLevel() {
    let currentLevel = world.level;
    if (currentLevel === level1) { initLevel1(); return; }
    if (currentLevel === level2) { initLevel2(); return; }
    if (currentLevel === level3) { initLevel3(); return; }
    if (currentLevel === level4) { initLevel4(); return; }
    if (currentLevel === level5) { initLevel5(); return; }
    if (currentLevel === level6) { initLevel6(); return; }
    if (currentLevel === level7) { initLevel7(); return; }
}

/**
 * Checks and initializes the next game level based on the world's state.
 */
function checkNextLevel() {
    let currentLevel = world.level;
    if (currentLevel === level1) { initLevel2(); return; }
    if (currentLevel === level2) { initLevel3(); return; }
    if (currentLevel === level3) { initLevel4(); return; }
    if (currentLevel === level4) { initLevel5(); return; }
    if (currentLevel === level5) { initLevel6(); return; }
    if (currentLevel === level6) { initLevel7(); return; }
}