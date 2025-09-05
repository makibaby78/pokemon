function spawnCowTile(xTile, yTile) {
    const px = xTile * TILE_SIZE;
    const py = yTile * TILE_SIZE;

    const frameW = 32;
    const frameH = 20;
    const scale = 2;
    const footHeight = TILE_SIZE;
    const hbOffsetY = Math.round(frameH * scale - footHeight);

    const animations = {
        walk: [0, 1],
        idle: [2, 3, 4],
    };

    const cow = new GameObject(
        px, py,                   // position
        'cow-sprite-edited.png',  // image
        frameW, frameH,           // frame size
        animations,               // put this for static frames[0]
        3,                        // fps = 0 → no animation
        scale,                    // scale (2x bigger)
        true,                     // loop doesn’t matter
        frameW * 2,               // hitbox width (1 tile)
        frameH * 2,               // hitbox height (1 tile)
        0, 0,                     // offset (so trunk is collidable, not leaves)
        0
    );

    // Patrol
    const patrolRadiusTiles = 3;
    const minX = Math.max(0, px - patrolRadiusTiles * TILE_SIZE);
    const maxX = Math.min(MAP_WIDTH * TILE_SIZE - TILE_SIZE, px + patrolRadiusTiles * TILE_SIZE);
    cow.patrol = { minX, maxX };

    cow.setPattern({ idleDuration: 5000, walkDuration: 2000, speed: 24, type: 'patrolIfPresent', initialDir: -1 });

    const speedPxPerSec = 24;
    cow.vx = -speedPxPerSec;

    // push into global lists used everywhere
    window.objects.push(cow);
    window.obstacles.push(cow);

    return cow;
}

function spawnChickenTile(xTile, yTile) {
    const px = xTile * TILE_SIZE;
    const py = yTile * TILE_SIZE;

    const frameW = 16;
    const frameH = 14;
    const scale = 2;
    const footHeight = TILE_SIZE;
    const hbOffsetY = Math.round(frameH * scale - footHeight);

    const animations = {
        walk: [2, 3, 4, 5],
        idle: [0, 1],
    };

    const chicken = new GameObject(
        px, py,                   // position
        'chicken-merged.png',     // image
        frameW, frameH,           // frame size
        animations,               // put this for static frames[0]
        6,                        // fps = 0 → no animation
        scale,                    // scale (2x bigger)
        true,                     // loop doesn’t matter
        frameW * 2,               // hitbox width (1 tile)
        frameH * 2,               // hitbox height (1 tile)
        0, 0,                     // offset (so trunk is collidable, not leaves)
        0
    );

    // Patrol
    const patrolRadiusTiles = 3;
    const minX = Math.max(0, px - patrolRadiusTiles * TILE_SIZE);
    const maxX = Math.min(MAP_WIDTH * TILE_SIZE - TILE_SIZE, px + patrolRadiusTiles * TILE_SIZE);
    chicken.patrol = { minX, maxX };

    chicken.setPattern({ idleDuration: 500, walkDuration: 1000, speed: 80, type: 'patrolIfPresent', initialDir: -1 });

    const speedPxPerSec = 24;
    chicken.vx = -speedPxPerSec;

    // push into global lists used everywhere
    window.objects.push(chicken);
    window.obstacles.push(chicken);

    return chicken;
}

function simpleObject(name, gridX, gridY, options = {}) {
    const {
        width = TILE_SIZE,       // default frame width
        height = TILE_SIZE,      // default frame height
        scale = 1,               // default scale
        offsetX = 0,
        offsetY = 0,
        hitboxWidth = width * scale,
        hitboxHeight = height * scale,
    } = options;

    const obj = new GameObject(
        gridX * TILE_SIZE,   // position X
        gridY * TILE_SIZE,   // position Y
        name + '.png',       // image filename
        width * scale,       // frame width
        height * scale,      // frame height
        [0],                 // only one frame
        0,                   // fps = 0 → no animation
        scale,               // scale
        false,               // loop (irrelevant for single frame)
        hitboxWidth,         // hitbox width
        hitboxHeight,        // hitbox height
        offsetX,             // hitbox offset X
        offsetY              // hitbox offset Y
    );

    objects.push(obj);
    obstacles.push(obj);

    return obj; // in case you want direct reference
}

simpleObject('seedling', 16, 11, { width:10, height: 11, scale: 2 });
simpleObject('bush', 25, 8, { width:16, height: 16, scale: 2 });

spawnCowTile(22, 9);
spawnChickenTile(14, 14);