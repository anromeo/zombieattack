
function AddSkeletons(game) {
	if (!game.map.isBossMap) {
        game.skeletonCooldown -= game.clockTick; // decrements the zombie cooldown by the clock of the game

        // IF the zombieCooldown gets less than 0
        if (game.skeletonCooldown < 0) {

            // IF there exists a player on the board
            // AND the player is not removed from world
            if (game.player && !game.player.removeFromWorld) {

                // decrease the skeletonCooldownNum
                // exponentially as the distance between the player and the
                // origin of the gameboard goes down 
                var dist = distance(game.player, {x:0, y:0});
                if (dist !== 0) {

                    // the half life used to project the spawn rate of the zombies.
                    var halfLife = 3000;

                    // the formula for the curent zombie cooldown.
                    game.skeletonCooldown = game.skeletonCooldownNumInitial * Math.pow((1/2), dist / halfLife);
                }

                // Adds the zombie entity to the game
                var spi;
                if (!game.map.spawnPoints) {
                    spi = new Skeleton(game);
                } else {
                    spi = new Skeleton(game, undefined, undefined, game.map.spawnPoints);
                }
                game.addEntity(spi);
            }
        }
    }
}

function Skeleton(game, x, y, spawnPoints) {
	Villain.call(this, game, x, y, spawnPoints);
	
	this.radius = 20;
	this.SpriteHeight = 132;
	this.SpriteWidth = 132;
	this.CenterOffsetX = 30; // puts the center of the sprite in the center of the entity
	this.CenterOffsetY = 20;  //puts the center of the sprite in the center of the entity
	
	
    this.player = 1;
    
    this.visualRadius = 100;
    this.approachingDistance = 600;

    this.attackRange = 24; // always make sure attack range is larger than comfort zone
    this.comfortZone = 15;
    this.exp = 1;

    this.name = "Skeleton";
    this.type = "villain";
    this.color = "Red";

    this.team = "Black";

    this.maxSpeed = 100;
    this.healthMAX = 200;
	this.health = this.healthMAX;
    this.strength = 30;
	//setMovingAnimation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/SkeletonWalk.png"), this.SpriteHeight, this.SpriteWidth, .02, 24, true, false, 24);
	this.setAttackAnimation(ASSET_MANAGER.getAsset("./images/SkeletonAttack.png"), this.SpriteHeight, this.SpriteWidth, .02, 24, true, false, 24);

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
    this.radialOffset = 15;

};

Skeleton.prototype = new Villain();
Skeleton.prototype.constructor = Skeleton;
