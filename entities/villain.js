function Villain(game, clone) {
    this.radius = 64;
    // LivingEntity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1);
    LivingEntity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1);
	this.x = 850;
	this.y = this.game.surfaceHeight * Math.random();
	
	this.radius = 64;
	this.SpriteHeight = 60;
	this.SpriteWidth = 60;
    this.player = 1;
    this.radius = 32;
    this.visualRadius = 10000;

    this.attackRange = 40; // always make sure attack range is larger than comfort zone
    this.comfortZone = 25;

    this.angleOffset = 260;
    this.name = "Villain";
    this.type = "villain";
    this.color = "Red";

    this.team = "Black";

    this.maxSpeed = minSpeed + (maxSpeed - minSpeed) * Math.random();
    this.healthMAX = 100;
	this.health = this.healthMAX;
    this.strength = 40;
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/zombie-moving.png"), this.SpriteHeight, this.SpriteWidth, .05, 25, true, false, 5);

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

};

Villain.prototype = new LivingEntity();
Villain.prototype.constructor = Villain;

Villain.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Villain.prototype.collideLeft = function () {
    return false;//(this.x - this.radius) < 0;
};

Villain.prototype.collideRight = function () {
    return false;//(this.x + this.radius) > 800;
};

Villain.prototype.collideTop = function () {
    return false;//(this.y - this.radius) < 0;
};

Villain.prototype.collideBottom = function () {
    return false;//(this.y + this.radius) > 800;
};

Villain.prototype.update = function () {
    this.aiUpdate("zombie");
    if (this.action.target === null) {
        this.flockTogether();
    }
};
