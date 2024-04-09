let level3;

function setLevelBasicsLevel3() {
    currentLevelText = 'Level 3';
    lengthMultiplierOfMap = 3;
    maxLevelLength = 1919 * lengthMultiplierOfMap;
}

function setGameplaySettingsLevel3() {
    maxEnemySpeed = 1.8;
    throwCooldown = 1800;
    throwDamage = 15;
    enemyDamage = 15;
}

function setEndbossSettingsLevel3() {
    endbossDamage = 16;
    endbossSpeed = 7;
    endbossSpawn = maxLevelLength + 700;
}

function setEnemyCountsLevel3() {
    chickenCount = 5;
    chickCount = 13;
}

function setCollectableObjectsCountsLevel3() {
    coinsCount = 19;
    throwableObjectCount = 11;
}

function initLevel3() {
    setLevelBasicsLevel3();
    setCollectableObjectsCountsLevel3();
    setGameplaySettingsLevel3();
    setEndbossSettingsLevel3();
    setEnemyCountsLevel3();
    setLevel3();
}

function setLevel3() {
    level3 = createLevel3();
    setTimeout(() => world.setLevel(level3), 1);
}

function createLevel3() {
    return new Level(
        createBackgroundObjects(lengthMultiplierOfMap),
        [new Cloud()],
        createEnemies(chickenCount, chickCount),
        [new Endboss(endbossSpawn, endbossDamage, endbossSpeed)],
        createCoins(coinsCount),
        createThrowableObjects(throwableObjectCount)
    );
}
