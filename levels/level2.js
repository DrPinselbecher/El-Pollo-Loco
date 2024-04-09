let level2;

function setLevelBasicsLevel2() {
    currentLevelText = 'Level 2';
    lengthMultiplierOfMap = 3;
    maxLevelLength = 1919 * lengthMultiplierOfMap;
}

function setGameplaySettingsLevel2() {
    maxEnemySpeed = 1.2;
    throwCooldown = 1400;
    throwDamage = 15;
    enemyDamage = 12;
}

function setEndbossSettingsLevel2() {
    endbossDamage = 20;
    endbossSpeed = 6.5;
    endbossSpawn = maxLevelLength + 700;
}

function setEnemyCountsLevel2() {
    chickenCount = 15;
    chickCount = 4;
}

function setCollectableObjectsCountsLevel2() {
    coinsCount = 18;
    throwableObjectCount = 13;
}

function initLevel2() {
    setLevelBasicsLevel2();
    setCollectableObjectsCountsLevel2();
    setGameplaySettingsLevel2();
    setEndbossSettingsLevel2();
    setEnemyCountsLevel2();
    setLevel2();
}

function setLevel2() {
    level2 = createLevel2();
    setTimeout(() => world.setLevel(level2), 1);
}

function createLevel2() {
    return new Level(
        createBackgroundObjects(lengthMultiplierOfMap),
        [new Cloud()],
        createEnemies(chickenCount, chickCount),
        [new Endboss(endbossSpawn, endbossDamage, endbossSpeed)],
        createCoins(coinsCount),
        createThrowableObjects(throwableObjectCount)
    );
}