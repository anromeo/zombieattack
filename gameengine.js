// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = true;
//        console.log(e);
        e.preventDefault();
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.space = null;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
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

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

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
    this.currentAnimation = movingAnimation;
}

LivingEntity.prototype = new Entity();
LivingEntity.prototype.constructor = LivingEntity;

LivingEntity.prototype.setMovingAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.movingAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse);
}

LivingEntity.prototype.setAttackAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.attackAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse);
}

LivingEntity.prototype.setStruckAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.struckAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse);
}

LivingEntity.prototype.setDeathAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.deathAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse);
}

LivingEntity.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

LivingEntity.prototype.update = function () {
    if (this.health === 0) {
        this.currentAnimation = this.deathAnimation;
    } else if (/* Attack button is pressed */) {
        this.currentAnimation = this.attackAnimation;
    } else {
        this.currentAnimation = this.movingAnimation;
    }
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
