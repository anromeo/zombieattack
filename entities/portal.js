function Portal(game, image) {
    // NonLivingEntity.prototype.setImage.call(this, image);
    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.image = image;
    this.game = game;
    // this.x = Math.random() * 600;
    // this.y = Math.random() * 600;
    this.x = 100;
    this.y = 100;

    this.canvasX = 100;
    this.canvasY = 100;

    this.shooting = false;
    this.radius = 30;
    this.name = "Portal";
    this.type = "portal";
    this.newTemp = 0;
    this.newTemp2 = 0;
}

Portal.prototype = new NonLivingEntity();
FlameThrower.prototype.constructor = FlameThrower;

FlameThrower.prototype.update = function () {
    // if (this.game.click) {
    //     console.log("shooting");
    //     this.shooting = true;
    //     this.game.addEntity(new Flame(this.game, ASSET_MANAGER.getAsset("./images/flame2.png")));
    // } 
    //     this.shooting = false;
}

FlameThrower.prototype.draw = function (ctx) {
      NonLivingEntity.prototype.draw.call(this, ctx);

}

function Flame(game, spritesheet) {
    Entity.call(this, game, this.x, this.y);
    this.spriteSheet = spritesheet;
    this.animation = new Animation(spritesheet, 38, 39, 0.05, 5, false, false, 5);  
    this.game = game;
    this.name = "Flame";
    this.type = "projectile";
    this.ctx = game.ctx;
    this.radius = 30;
    this.maxSpeed = 200;
    this.thrown = false;
    this.strength = 100;
    this.velocity = { x: 0, y: 0 };
}

Flame.prototype = new LivingEntity();
Flame.prototype.constructor = Flame;

Flame.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Flame.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Flame.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Flame.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Flame.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Flame.prototype.update = function () {
    LivingEntity.prototype.update.call(this);
    // //console.log(this.velocity);
    // var temp = this.velocity.x * this.game.clockTick;
    // var temp2 = this.velocity.y * this.game.clockTick;
    // this.newTemp += temp;
    // this.newTemp2 += temp2;
    // this.x += temp;
    // this.y += temp2;

    // if (this.newTemp > 7) this.removeFromWorld = true;
    // if (this.newTemp2 > 7) this.removeFromWorld = true;

    // if (this.collideLeft() || this.collideRight()) {
    //     this.removeFromWorld = true;
    //     this.velocity.x = 0;
    //     this.velocity.y = 0;
    //     if (this.collideLeft()) this.x = this.radius;
    //     if (this.collideRight()) this.x = 800 - this.radius;
    // }

    // if (this.collideTop() || this.collideBottom()) {
    //     this.removeFromWorld = true;
    //     this.velocity.x = 0;
    //     this.velocity.y = 0;
    //     if (this.collideTop()) this.y = this.radius;
    //     if (this.collideBottom()) this.y = 800 - this.radius;
    // }

    // var chasing = false;
    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && ent.name === "Flame" && this.thrown && ent.thrown && this.collide(ent)) {
    //         var temp = { x: this.velocity.x, y: this.velocity.y };

    //         var dist = distance(this, ent);
    //         var delta = this.radius + ent.radius - dist;
    //         var difX = (this.x - ent.x) / dist;
    //         var difY = (this.y - ent.y) / dist;

    //         this.x += difX * delta / 2;
    //         this.y += difY * delta / 2;
    //         ent.x -= difX * delta / 2;
    //         ent.y -= difY * delta / 2;

    //         this.velocity.x = ent.velocity.x * friction;
    //         this.velocity.y = ent.velocity.y * friction;
    //         ent.velocity.x = temp.x * friction;
    //         ent.velocity.y = temp.y * friction;
    //         this.x += this.velocity.x * this.game.clockTick;
    //         this.y += this.velocity.y * this.game.clockTick;
    //         ent.x += ent.velocity.x * this.game.clockTick;
    //         ent.y += ent.velocity.y * this.game.clockTick;
    //     }
    // }

    // var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    // if (speed > this.maxSpeed) {
    //     var ratio = this.maxSpeed / speed;
    //     this.velocity.x *= ratio;
    //     this.velocity.y *= ratio;
    // }

    // this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    // this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
    // this.newTemp = 0;
    // this.newTemp2 = 0;
}

Flame.prototype.draw = function (ctx) {

//    console.log("this.X: " + this.x + "| this.Y: " + this.y);
    // Removed game.x and game.y
    // var rad = Math.atan2(this.game.playerY - this.game.y, this.game.playerX - this.game.x);
    // var deg = rad * (180 / Math.PI);
    this.animation.drawFrameRotate(this.game.clockTick, this.ctx, this.x - this.game.getWindowX(), this.y- this.game.getWindowY(), 0, 0, 5);
 }