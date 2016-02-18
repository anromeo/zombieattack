function Demon(game) {
    this.name = "Zombie";
    this.animation = new Animation(AM.getAsset("./img/demon-walking.png"), 64, 64, .05, 8, true, false, 8);
    this.radius = 100;
    this.ground = 400;
    this.x = 200;
    this.y = 200;
    this.angle = 0;
    this.currentDirectionX = 0;
    this.currentDirectionY = -2;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 400);
}

Demon.prototype = new Entity();
Demon.prototype.constructor = Demon;

Demon.prototype.update = function () {


    if (this.currentDirectionY + this.y <= 0) {
        this.currentDirectionY = 1;
        this.currentDirectionX = 1;
        this.angle = 135;
    } else if (this.currentDirectionY + this.y + this.animation.frameHeight > 800) {
        this.currentDirectionY = 0;
        this.currentDirectionX = -2;
        this.angle = 270;
    } else if (this.currentDirectionX + this.x <= 0) {
        this.currentDirectionY = -2;
        this.currentDirectionX = 0;
        this.angle = 360;
    } else if (this.currentDirectionX + this.x + this.animation.frameWidth > 800) {
        this.currentDirectionY = 2;
        this.currentDirectionX = 0;
        this.angle = 180;
    }

    this.x += this.currentDirectionX;
    this.y += this.currentDirectionY;
    Entity.prototype.update.call(this);
}

Demon.prototype.draw = function () {
    this.animation.drawFrameRotate(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
    
}

AM.queueDownload("./img/demon-walking.png");