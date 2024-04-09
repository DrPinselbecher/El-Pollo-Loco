let level1;

/**
 * Sets basic configurations for Level 1.
 */
function setLevelBasicsLevel1() {
    currentLevelText = 'Level 1';
    lengthMultiplierOfMap = 3;
    maxLevelLength = 1919 * lengthMultiplierOfMap;
}

/**
 * Sets gameplay settings specific to Level 1.
 */
function setGameplaySettingsLevel1() {
    maxEnemySpeed = 0.8;
    throwCooldown = 700;
    throwDamage = 20;
    enemyDamage = 10;
}

/**
 * Defines the settings for the endboss in Level 1.
 */
function setEndbossSettingsLevel1() {
    endbossDamage = 20;
    endbossSpeed = 5;
    endbossSpawn = maxLevelLength + 700;
}

/**
 * Determines the count of each type of enemy for Level 1.
 */
function setEnemyCountsLevel1() {
    chickenCount = 5;
    chickCount = 1;
}

/**
 * Sets the count for collectable objects in Level 1.
 */
function setCollectableObjectsCountsLevel1() {
    coinsCount = 18;
    throwableObjectCount = 9;
}

/**
 * Initializes Level 1 with its specific settings and entities.
 */
function initLevel1() {
    setLevelBasicsLevel1();
    setCollectableObjectsCountsLevel1();
    setGameplaySettingsLevel1();
    setEndbossSettingsLevel1();
    setEnemyCountsLevel1();
    setLevel1();
}

/**
 * Configures Level 1, including its entities and settings.
 */
function setLevel1() {
    level1 = createLevel1();
    if (world) world.setLevel(level1);
}

/**
 * Creates the Level 1 instance with all required components and settings.
 * @returns {Level} The configured Level 1 instance.
 */
function createLevel1() {
    return new Level(
        createBackgroundObjects(lengthMultiplierOfMap),
        [new Cloud()],
        createEnemies(chickenCount, chickCount),
        [new Endboss(endbossSpawn, endbossDamage, endbossSpeed)],
        createCoins(coinsCount),
        createThrowableObjects(throwableObjectCount)
    );
}
