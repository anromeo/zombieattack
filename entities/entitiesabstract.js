var friction = 1;
var maxSpeed = 100;
var minSpeed = 5;


function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    if(this.game) {
        this.ctx = game.ctx;
    }
    this.removeFromWorld = false;
}

Entity.prototype.setLocation = function (X, Y) {
    this.x = X;
    this.y = Y;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

// @deprecated
// Entity.prototype.rotateAndCache = function (image, angle) {
//     var offscreenCanvas = document.createElement('canvas');
//     var size = Math.max(image.width, image.height);
//     offscreenCanvas.width = size;
//     offscreenCanvas.height = size;
//     var offscreenCtx = offscreenCanvas.getContext('2d');
//     offscreenCtx.save();
//     offscreenCtx.translate(size / 2, size / 2);
//     offscreenCtx.rotate(angle);
//     offscreenCtx.translate(0, 0);
//     offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
//     offscreenCtx.restore();
//     //offscreenCtx.strokeStyle = "red";
//     //offscreenCtx.strokeRect(0,0,size,size);
//     return offscreenCanvas;
// }

function LivingEntity(game, pointerX, pointerY, directionX, directionY, locationX, locationY) {
    Entity.call(this, game, locationX, locationY);
    this.pointerX = pointerX;
    this.pointerY = pointerY;
    this.directionX = directionX;
    this.directionY = directionY;
    this.health = 100;
    this.strength = 25;
    this.speed = 10;
    this.movingAnimation = null;
    this.attackAnimation = null;
    this.struckAnimation = null;
    this.deathAnimation = null;
    this.currentAnimation = null;
}

LivingEntity.prototype = new Entity();
LivingEntity.prototype.constructor = LivingEntity;

LivingEntity.prototype.setMovingAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.movingAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

LivingEntity.prototype.setAttackAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.attackAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

LivingEntity.prototype.setStruckAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.struckAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

LivingEntity.prototype.setDeathAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.deathAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

// LivingEntity.prototype.draw = function () {
//     this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
// }

LivingEntity.prototype.draw = function () {
    if (this.movingAnimation) {
        this.movingAnimation.drawFrameRotate(this.game.clockTick, this.ctx, this.x, this.y, this.angle);
    }
//    Entity.draw();
}

LivingEntity.prototype.update = function () {
    // if (this.health === 0) {
    //     this.currentAnimation = this.deathAnimation;
    // } else if (/* Attack button is pressed */) {
    //     this.currentAnimation = this.attackAnimation;
    // } else {
    //     this.currentAnimation = this.movingAnimation;
    // }
}

function NonLivingEntity(game, locationX, locationY) {
    Entity.call(this, game, locationX, locationY);
    this.image = null;
}

NonLivingEntity.prototype = new Entity();
NonLivingEntity.prototype.constructor = NonLivingEntity;

NonLivingEntity.prototype.setImage = function (image) {
    this.image = image;
}

NonLivingEntity.prototype.setLocation = function (X, Y) {
    Entity.prototype.setLocation.call(this, X, Y);
}

NonLivingEntity.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);

}

NonLivingEntity.prototype.update = function () {
    
}