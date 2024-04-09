let level5;

function setLevelBasicsLevel5() {
    currentLevelText = 'Last level';
    lengthMultiplierOfMap = 6;
    maxLevelLength = 1919 * lengthMultiplierOfMap;
    maximumLevelReached = true;
}

function setGameplaySettingsLevel5() {
    maxEnemySpeed = 3;
    throwCooldown = 1500;
    throwDamage = 20;
    enemyDamage = 20;
}

function setEndbossSettingsLevel5() {
    endbossDamage = 20;
    endbossSpeed = 7;
    endbossSpawn = maxLevelLength + 700;
}

function setEnemyCountsLevel5() {
    chickenCount = 0;
    chickCount = 35;
}

function setCollectableObjectsCountsLevel5() {
    coinsCount = 19;
    throwableObjectCount = 15;
}

function initLevel5() {
    setLevelBasicsLevel5();
    setCollectableObjectsCountsLevel5();
    setGameplaySettingsLevel5();
    setEndbossSettingsLevel5();
    setEnemyCountsLevel5();
    setLevel5();
}

function setLevel5() {
    level5 = createLevel5();
    setTimeout(() => world.setLevel(level5), 1);
}

function createLevel5() {
    return new Level(
        createBackgroundObjects(lengthMultiplierOfMap),
        [new Cloud()],
        createEnemies(chickenCount, chickCount),
        [new Endboss(endbossSpawn, endbossDamage, endbossSpeed)],
        createCoins(coinsCount),
        createThrowableObjects(throwableObjectCount)
    );
}
