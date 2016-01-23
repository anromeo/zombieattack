function Demon(game) {
    this.radius = 100;
    this.ground = 400;
    this.angle = 0;
    LivingEntity.call(this, game, 0, 0, 0, -2, 0, 400);
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/demon.png"), 64, 64, .05, 8, true, false, 8)
}

Demon.prototype = new LivingEntity();
Demon.prototype.constructor = Demon;

Demon.prototype.update = function () {


    if (this.directionX + this.y <= 0) {
        this.directionY = 1;
        this.directionX = 1;
        this.angle = 135;
    } else if (this.directionY + this.y + this.movingAnimation.frameHeight > 800) {
        this.directionY = 0;
        this.directionX = -2;
        this.angle = 270;
    } else if (this.directionX + this.x <= 0) {
        this.directionY = -2;
        this.directionX = 0;
        this.angle = 360;
    } else if (this.directionX + this.x + this.movingAnimation.frameWidth > 800) {
        this.directionY = 2;
        this.directionX = 0;
        this.angle = 180;
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.currentAnimation = this.movingAnimation;
    Entity.prototype.update.call(this);
}

ASSET_MANAGER.queueDownload("./images/demon.png");