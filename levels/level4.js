let level4;

function setLevelBasicsLevel4() {
    currentLevelText = 'Level 4';
    lengthMultiplierOfMap = 4;
    maxLevelLength = 1919 * lengthMultiplierOfMap;
}

function setGameplaySettingsLevel4() {
    maxEnemySpeed = 2.2;
    throwCooldown = 1800;
    throwDamage = 15;
    enemyDamage = 17;
}

function setEndbossSettingsLevel4() {
    endbossDamage = 15;
    endbossSpeed = 7;
    endbossSpawn = maxLevelLength + 700;
}

function setEnemyCountsLevel4() {
    chickenCount = 10;
    chickCount = 13;
}

function setCollectableObjectsCountsLevel4() {
    coinsCount = 22;
    throwableObjectCount = 11;
}

function initLevel4() {
    setLevelBasicsLevel4();
    setCollectableObjectsCountsLevel4();
    setGameplaySettingsLevel4();
    setEndbossSettingsLevel4();
    setEnemyCountsLevel4();
    setLevel4();
}

function setLevel4() {
    level4 = createLevel4();
    setTimeout(() => world.setLevel(level4), 1);
}

function createLevel4() {
    return new Level(
        createBackgroundObjects(lengthMultiplierOfMap),
        [new Cloud()],
        createEnemies(chickenCount, chickCount),
        [new Endboss(endbossSpawn, endbossDamage, endbossSpeed)],
        createCoins(coinsCount),
        createThrowableObjects(throwableObjectCount)
    );
}
