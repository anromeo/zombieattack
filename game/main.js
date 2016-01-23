
function Background(game) {
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(0,500,800,300);
    Entity.prototype.draw.call(this);
}

// function Man(game, spritesheet) {
//     this.animation = new Animation(spritesheet, 79, 87, 0.05, 6, true, false); 
//     //this.spriteSheet = this.rotateAndCache((ASSET_MANAGER.getAsset("./img/man.png")), 90);
//    // this.animation = new Animation(spritesheet, 80, 80, 0.05, 1, true, false);
//     this.x = 0;
//     this.y = 0;
//     this.game = game;
//     this.ctx = game.ctx;
// }

// Man.prototype = new Entity();
// Man.prototype.constructor = Man;

// Man.prototype.update = function() {
//     this.x += 2;
// }


// Man.prototype.draw = function () {
//     console.log("drawing");
//     this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
// }

// the "main" code begins here

// var ASSET_MANAGER = new AssetManager();

// ASSET_MANAGER.queueDownload("./img/RobotUnicorn.png");
// ASSET_MANAGER.queueDownload("./img/man2.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
 
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Demon(gameEngine));

//    gameEngine.addEntity(new Man(gameEngine, ASSET_MANAGER.getAsset("./img/man2.png")));

});
