function HealthPack(game, image, spawnPoints, x, y) {
    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.image = image;
    this.game = game;
    this.spawnPoints = spawnPoints;

    if (x !== undefined && y !== undefined) {
        this.x = x;
        this.y = y;
    } else if (spawnPoints.length < 1) {
        this.x = 200;
        this.y = 200;
    } else {
        var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
        this.x = spawnpoint.x;
        this.y = spawnpoint.y;
    }

    this.width = 46;
    this.height = 31;

    this.canvasX = x;
    this.canvasY = y;

    this.radius = 40;
    this.name = "HealthPack";
    this.type = "item";
}

HealthPack.prototype = new NonLivingEntity();
HealthPack.prototype.constructor = HealthPack;

HealthPack.prototype.update = function () {
}

HealthPack.prototype.action = function (player) {
	if (player.health < player.healthMAX) {
		this.removeFromWorld = true;
		player.health += 50;
		if (player.health > player.healthMAX) {
			player.health = player.healthMAX;
		}
	}
}

HealthPack.prototype.draw = function (ctx) {
      NonLivingEntity.prototype.draw.call(this, ctx);
}
