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

    // added from 435 ZOMBIE AI Project
    this.zombies = [];
    this.players = [];
    this.rocks = [];
    this.zombieCooldown = 1;

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

// Marriot's code. Could be useful later.
// GameEngine.prototype.startInput = function () {
//     console.log('Starting input');
//     var that = this;

//     var getXandY = function (e) {
//         var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
//         var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

//         return { x: x, y: y };
//     }

//     this.ctx.canvas.addEventListener("mousemove", function (e) {
//         //console.log(getXandY(e));
//         that.mouse = getXandY(e);
//     }, false);

//     this.ctx.canvas.addEventListener("click", function (e) {
//         //console.log(getXandY(e));
//         that.click = getXandY(e);
//     }, false);

//     this.ctx.canvas.addEventListener("wheel", function (e) {
//         //console.log(getXandY(e));
//         that.wheel = e;
//         //       console.log(e.wheelDelta);
//         e.preventDefault();
//     }, false);

//     this.ctx.canvas.addEventListener("contextmenu", function (e) {
//         //console.log(getXandY(e));
//         that.rightclick = getXandY(e);
//         e.preventDefault();
//     }, false);

//     console.log('Input started');
// }

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
    
    // added from 435 ZOMBIE AI Project
    this.entities.push(entity);
    if (entity.name === "Zombie") this.zombies.push(entity);
    if (entity.name === "Rock") this.rocks.push(entity);
    else this.players.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

// GameEngine.prototype.update = function () {
//     var entitiesCount = this.entities.length;

//     for (var i = 0; i < entitiesCount; i++) {
//         var entity = this.entities[i];

//         if (!entity.removeFromWorld) {
//             entity.update();
//         }
//     }

//     for (var i = this.entities.length - 1; i >= 0; --i) {
//         if (this.entities[i].removeFromWorld) {
//             this.entities.splice(i, 1);
//         }
//     }
// }

// added from 435 ZOMBIE AI Project
GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    this.zombieCooldown -= this.clockTick;
    if (this.zombieCooldown < 0) {
        this.zombieCooldown = 1;
        var zom = new Zombie(this);
        this.addEntity(zom);
    }

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
    for (var i = this.zombies.length - 1; i >= 0; --i) {
        if (this.zombies[i].removeFromWorld) {
            this.zombies.splice(i, 1);
        }
    }
    for (var i = this.players.length - 1; i >= 0; --i) {
        if (this.players[i].removeFromWorld) {
            this.players.splice(i, 1);
        }
    }
    for (var i = this.rocks.length - 1; i >= 0; --i) {
        if (this.rocks[i].removeFromWorld) {
            this.rocks.splice(i, 1);
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.space = null;
}
