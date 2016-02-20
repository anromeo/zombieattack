function Background(game, image) {
    NonLivingEntity.call(this, game, 0, 400);
    this.radius = 200;
    NonLivingEntity.prototype.setImage(image);
   this.image = image;
}

Background.prototype = new NonLivingEntity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
    
}

Background.prototype.draw = function (ctx) {
     NonLivingEntity.prototype.draw.call(this, ctx);
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


/** From 435 */

ASSET_MANAGER.queueDownload("./images/demon.png");
ASSET_MANAGER.queueDownload("./images/ZombieWalking.png");
ASSET_MANAGER.queueDownload("./images/Player2.png");
ASSET_MANAGER.queueDownload("./images/background.png");

ASSET_MANAGER.queueDownload("./images/ForestLevelBig.png");
ASSET_MANAGER.queueDownload("./images/hospital.png");
ASSET_MANAGER.queueDownload("./images/boss.png");
ASSET_MANAGER.queueDownload("./images/flamethrower.png");
ASSET_MANAGER.queueDownload("./images/flame2.png");
ASSET_MANAGER.queueDownload("./images/cone.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    //var numZombies = 2;
    var numPlayers = 6;
    //var numRocks = 12;

    var gameEngine = new GameEngine();
	gameEngine.init(ctx);
    var circle;
    // for (var i = 0; i < numPlayers; i++) {
        // circle = new friendlyAI(gameEngine);
        // gameEngine.addEntity(circle);
    // }
    // for (var i = 0; i < numZombies; i++) {
		// console.log("added zombie");
        // circle = new Zombie(gameEngine);
        // gameEngine.addEntity(circle);
    // }

    // for (var i = 0; i < numRocks; i++) {
        // circle = new Rock(gameEngine);
        // gameEngine.addEntity(circle);
    // }

    var player = new playerControlled(gameEngine);
    var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./images/background.png"));
//    var boss = new Boss(gameEngine, ASSET_MANAGER.getAsset("./images/boss.png"));
    //gameEngine.addEntity(boss);
  //  gameEngine.addEntity(background);

    // var background = new Background(gameEngine, ASSET_MANAGER.getAsset("./images/background.png"));
    // var boss = new Boss(gameEngine, ASSET_MANAGER.getAsset("./images/boss.png"));
	var flamethrower = new FlameThrower(gameEngine, ASSET_MANAGER.getAsset("./images/flamethrower.png"));

    gameEngine.addEntity(flamethrower);
    player.controlled = true;
    gameEngine.addEntity(player);
    var player2 = new playerControlled(gameEngine);
    gameEngine.addEntity(player2);

    var player3 = new playerControlled(gameEngine);
    gameEngine.addEntity(player3);

    gameEngine.start();
    //gameEngine.addEntity(boss);
  //  gameEngine.addEntity(background);

  //  gameEngine.addEntity(player2);   

});

// ASSET_MANAGER.downloadAll(function () {
//     console.log("starting up da sheild");
//     var canvas = document.getElementById('gameWorld');
//     var ctx = canvas.getContext('2d');

//     var gameEngine = new GameEngine();
 
//     gameEngine.init(ctx);
//     gameEngine.start();

//     gameEngine.addEntity(new Demon(gameEngine));


// //    gameEngine.addEntity(new Man(gameEngine, ASSET_MANAGER.getAsset("./img/man2.png")));

// });
