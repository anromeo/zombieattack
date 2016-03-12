
function AddSpiders(game) {
	if (!game.map.isBossMap) {
        game.spiderCooldown -= game.clockTick; // decrements the zombie cooldown by the clock of the game

        // IF the zombieCooldown gets less than 0
        if (game.spiderCooldown < 0) {

            // IF there exists a player on the board
            // AND the player is not removed from world
            if (game.player && !game.player.removeFromWorld) {

                // decrease the zombieCooldownNum
                // exponentially as the distance between the player and the
                // origin of the gameboard goes down 
                var dist = distance(game.player, {x:0, y:0});
                if (dist !== 0) {

                    // the half life used to project the spawn rate of the zombies.
                    var halfLife = 3000;

                    // the formula for the curent zombie cooldown.
                    game.spiderCooldown = game.spiderCooldownNumInitial * Math.pow((1/2), dist / halfLife);
                }

                // Adds the zombie entity to the game
                var spi;
                if (!game.map.spawnPoints) {
                    spi = new Spider(game);
                } else {
                    spi = new Spider(game, undefined, undefined, game.map.spawnPoints);
                }
                game.addEntity(spi);
            }
        }
    }
}

function Spider(game, x, y, spawnPoints) {
	Villain.call(this, game, x, y, spawnPoints);
	
    // if (!spawnPoints) {
        // this.spawnPoints = [];
        // this.spawnPoints[0] = { x: 1360, y: 652 };
        // this.spawnPoints[1] = { x: 1231, y: 322 };
        // this.spawnPoints[2] = { x: 1338, y: 80 };
        // this.spawnPoints[3] = { x: 1073, y: 460 };
        // this.spawnPoints[4] = { x: 874, y: 411 };
        // this.spawnPoints[5] = { x: 939, y: 965 };
        // this.spawnPoints[6] = { x: 1027, y: 1225 };
        // this.spawnPoints[7] = { x: 910, y: 683 };
        // this.spawnPoints[8] = { x: 660, y: 1029 };
        // this.spawnPoints[9] = { x: 360, y: 1233 };
        // this.spawnPoints[10] = { x: 360, y: 924};
        // this.spawnPoints[11] = { x: 752, y: 1250 };
        // this.spawnPoints[12] = { x: 400, y: 632 };
        // this.spawnPoints[13] = { x: 1248, y: 1221 };
    // } else {
        // this.spawnPoints = spawnPoints;   
    // }

    // var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];


    // LivingEntity.call(this, game, spawnpoint.x, spawnpoint.y);

    // if (x !== undefined) {
        // this.x = x;
    // }
    // if (y !== undefined) {
        // this.y = y;
    // }
	// this.x = 850;
	// this.y = this.game.surfaceHeight * Math.random();
	
	this.radius = 10;
	this.SpriteHeight = 23;
	this.SpriteWidth = 23;
	this.CenterOffsetX = -15; // puts the center of the sprite in the center of the entity
	this.CenterOffsetY = -15;  //puts the center of the sprite in the center of the entity

	
    this.player = 1;
    
    this.visualRadius = 100;
    this.approachingDistance = 600;

    this.attackRange = 34; // always make sure attack range is larger than comfort zone
    this.comfortZone = 25;
    this.exp = 1;

    this.name = "Spider";
    this.type = "villain";
    this.color = "Red";

    this.team = "Black";

    this.maxSpeed = 150;
    this.healthMAX = 10;
	this.health = this.healthMAX;
    this.strength = 2;
	//setMovingAnimation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/Spider1.png"), this.SpriteHeight, this.SpriteWidth, .02, 4, true, false, 4);

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    this.radialOffset = 15;

	this.showHealthBar = false;
};

Spider.prototype = new Villain();
Spider.prototype.constructor = Spider;
