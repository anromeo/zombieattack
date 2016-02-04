function Boss(game, spritesheet) {
    this.animation = new Animation(spritesheet, 132, 87, 0.05, 1, true, false); 
    this.radius = 32;
    this.name = "Zombie";
    LivingEntity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, this.radius + Math.random() * (800 - this.radius * 2) * -1, 150, 150);
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/boss.png"), 132, 187, .05, 1, true, false, 1);
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.visualRadius = 1000;
    this.maxSpeed = 100;
    this.health = 500;
}
Boss.prototype = new LivingEntity();
Boss.prototype.constructor = Boss;

Boss.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Boss.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Boss.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Boss.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Boss.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Boss.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);

    this.x += this.directionX * this.game.clockTick;
    this.y += this.directionY * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.directionX = -this.directionX * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.directionX * this.game.clockTick;
        this.y += this.directionY * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.directionY = -this.directionY * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.directionX * this.game.clockTick;
        this.y += this.directionY * this.game.clockTick;
    }

    var chasing = false;
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.name === "Zombie") {
                var temp = { x: this.directionX, y: this.directionY };

                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x) / dist;
                var difY = (this.y - ent.y) / dist;

                this.x += difX * delta / 2;
                this.y += difY * delta / 2;
                ent.x -= difX * delta / 2;
                ent.y -= difY * delta / 2;

                this.directionX = ent.directionX * friction;
                this.directionY = ent.directionY * friction;
                ent.directionX = temp.x * friction;
                ent.directionY = temp.y * friction;
                this.x += this.directionX * this.game.clockTick;
                this.y += this.directionY * this.game.clockTick;
                ent.x += ent.directionX * this.game.clockTick;
                ent.y += ent.directionY * this.game.clockTick;
            }
            if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving" && !ent.removeFromWorld) {
                ent.removeFromWorld = true;
//                console.log(ent.name + " kills: " + ent.kills);
                var newZombie = new Zombie(this.game, ent);
                this.game.addEntity(newZombie);
            }
            if (ent.name === "Rock" && ent.thrown) {
                ent.removeFromWorld = true;
                this.health -= ent.strength;
                if (this.health <= 0) {
                    this.removeFromWorld = true;
                }
//                console.log("My health is " + this.health);
                ent.thrown = false;
                ent.directionX = 0;
                ent.directionY = 0;
                ent.thrower.kills++;
            }
        }
        var acceleration = 1000000;

        if (ent.name !== "Zombie" && ent.name !== "Rock" && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (dist > this.radius + ent.radius + 2) {
                console.log(dist);
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.directionX += difX * acceleration / (dist * dist);
                this.directionY += difY * acceleration / (dist * dist);
            }
            chasing = true;
        }

        
    }

    // if (!chasing) {
    //     ent = this.game.zombies[randomInt(this.game.zombies.length)];
    //     var dist = distance(this, ent);
    //     if (dist > this.radius + ent.radius + 2) {
    //         var difX = (ent.x - this.x) / dist;
    //         var difY = (ent.y - this.y) / dist;
    //         this.directionX += difX * acceleration / (dist * dist);
    //         this.directionY += difY * acceleration / (dist * dist);
    //     }
    // }

    var speed = Math.sqrt(this.directionX * this.directionX + this.directionY * this.directionY);
    if (speed > this.maxSpeed) {
        var ratio = this.maxSpeed / speed;
        this.directionX *= ratio;
        this.directionY *= ratio;
    }

    this.directionX -= (1 - friction) * this.game.clockTick * this.directionX;
    this.directionY -= (1 - friction) * this.game.clockTick * this.directionY;

    //console.log(Math.atan(this.directionX / this.directionY)* (180/Math.PI));
    //this.angle = Math.atan(this.directionX / this.directionY) * (180/Math.PI);
    //console.log("this.directionX" + this.directionX + "this.directionY" + this.directionY + "this.x" + this.x + "this.y" + this.y);
    this.angle = Math.atan2(this.directionY , this.directionX) * (180/Math.PI); //-  Math.atan2(this.x , this.y) * (180/Math.PI);
    //this.angle = Math.atan2(-1 , -1) * (180/Math.PI) -  Math.atan2(0 , 0) * (180/Math.PI);
    this.angle = this.angle;
    while (this.angle > 360) {
        this.angle = this.angle - 360;
    }
    //console.log("angle in zombie: " + this.angle);
    // this.x += this.directionX;
    // this.y += this.directionY;
    // this.currentAnimation = this.movingAnimation;
    // Entity.prototype.update.call(this);

};

Boss.prototype.draw = function (ctx) {
        LivingEntity.prototype.draw.call(this, ctx);
};