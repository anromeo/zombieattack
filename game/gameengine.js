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
    this.zombieCooldownNum = 3;  //how often a zombie will appear
	this.zombieCooldown = this.zombieCooldownNum;

    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.degree = null;
    this.x = null;
    this.y = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;

    this.windowX = 0;
    this.windowY = 0;

    // Quinn's Additions
    this.keyState = null;
    this.keydown = null;
    this.startInput();
    this.timer = new Timer();
    this.keydown = {key:"", x:0, y:0};
    this.keyState = {};
    console.log('game initialized');
}

GameEngine.prototype.getWindowX = function() {
    return this.windowX;
}

GameEngine.prototype.getWindowY = function() {
    return this.windowY;
}

GameEngine.prototype.setWindowX = function(x) {
    if (x < 0) {
        this.windowX = 0;
    } else if (x > 400) {
        this.windowX = 400;
    } else {
        this.windowX = x;
    }
}

GameEngine.prototype.setWindowY = function(y) {
        if (y < 0) {
        this.windowY = 0;
    } else if (y > 400) {
        this.windowY = 400;
    } else {
        this.windowY = y;
    }
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.ctx.showOutlines = false;
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
	//var that = this;
    var getXandY = function(e) {
        // var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left - (that.ctx.canvas.width/2);
        // var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top - (that.ctx.canvas.height/2);
        var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        //console.log("x: " + x + " y: " + y);
        return {x: x, y: y};
    }
	
	    var getXandYWithWindowOffset = function(e) {
        // var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left - (that.ctx.canvas.width/2);
        // var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top - (that.ctx.canvas.height/2);
        var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left + that.getWindowX();
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top + that.getWindowY();
        //console.log("x: " + x + " y: " + y);
        return {x: x, y: y};
    }
    // var getDegree = function(e) {
    //     var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left;
    //     var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
    //     var rad = Math.atan2(y, x); 
    //     var deg = rad * (180 / Math.PI);
    //     return deg;
    // }
    var getX = function(e) {
        var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        return x;
    }
    var getY = function(e) {
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return y;
    }
    // var getKeyDir = function(e) {
        // //e = (KeyboardEvent) e
        // //console.log(e);
        // var key =  "";
        // var x = 0;
        // var y = 0;
        // switch(e.keyCode) {
            // case 37:
            // key = "left"
            // x = -1;
            // //console.log(key + " " + e);
            // GameEngine.setWindowY(GameEngine.getWindowY() - 5);
            // break;
            // case 38:
            // key = "up"
            // y = -1;
            // //console.log(key + " " + e);
            // GameEngine.setWindowX(GameEngine.getWindowX() - 5);
            // break;
            // case 39:
            // key = "right"
            // x = 1;
            // //console.log(key + " " + e);
            // GameEngine.setWindowY(GameEngine.getWindowY() + 5);
            // break;
            // case 40:
            // key = "down"
            // y = 1;
            // //console.log(key + " " + e);
            // GameEngine.setWindowX(GameEngine.getWindowX() + 5);
            // break;
            // default:
            // console.log("default: " + e);
            // break;          
        // }       
        // console.log(GameEngine.getWindowX(), + " " + GameEngine.getWindowY());
        // return {key:key, x: x, y: y};
    // }
    var that = this;

    if (this.ctx) {
        this.ctx.canvas.addEventListener("click", function(e) {
            //that.click = getXandY(e);
			that.click = getXandYWithWindowOffset(e);
            e.stopPropagation();
            e.preventDefault();
        }, false);
        
        this.ctx.canvas.addEventListener("mousemove", function(e) {
            //that.mouse = getXandY(e);       
			that.mouse = getXandYWithWindowOffset(e); 
			that.x = that.mouse.x;
            that.y = that.mouse.y;
            // that.x = getX(e);
            // that.y = getY(e);
        }, false);
    }
    window.addEventListener('keydown',function(e){
        e.preventDefault();
        that.keyState[e.keyCode] = true;
        // console.log("keyCode DOWN" + e.keyCode);
        // switch(e.keyCode) {
            // case 37:
            // that.setWindowX(that.getWindowX() - 5);
            // break;
            // case 38:
            // that.setWindowY(that.getWindowY() - 5);
            // break;
            // case 39:
            // that.setWindowX(that.getWindowX() + 5);
            // break;
            // case 40:
            // that.setWindowY(that.getWindowY() + 5);
            // break;
            // default:
            // //console.log("default: " + e);
            // break;          
        // }    
         //console.log(that.getWindowX() + " " + that.getWindowY());
    },false);    
    window.addEventListener('keyup',function(e){
        e.preventDefault();
        that.keyState[e.keyCode] = false;
        //console.log("keyCode UP" + e.keyCode);
    },false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    
    // added from 435 ZOMBIE AI Project
    this.entities.push(entity);
    if (entity.name === "Zombie") this.zombies.push(entity);
    if (entity.name === "Rock") this.rocks.push(entity);
    else this.players.push(entity);
}

GameEngine.prototype.draw = function (top, left) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    //console.log(this.GameEngine.getWindowX() + " " + this.GameEngine.getWindowY());
	var ratio = 1.1; //1.2
    this.ctx.drawImage(ASSET_MANAGER.getAsset("./images/background.jpg"), this.getWindowX() * ratio, this.getWindowY() * ratio, 400, 400, 0, 0, 800, 800);
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
   // this.ctx.drawImage(ASSET_MANAGER.getAsset("./images/background.jpg"), 0, 0);
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
        this.zombieCooldown = this.zombieCooldownNum;
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
    this.click = null;
    this.rightclick = null;
    this.wheel = null;
    this.space = null;
}



        // var game = document.getElementById("game");
        // var gameCtx = game.getContext("2d");

        // var left = 20;
        // var top = 20;

        // var background = new Image();
        // background.onload = function () {
        //     gameCtx.fillStyle = "red";
        //     gameCtx.strokeStyle = "blue";
        //     gameCtx.lineWidth = 3;
        //     move(top, left);
        // }
        // background.src = "https://dl.dropboxusercontent.com/u/139992952/stackoverflow/game.jpg";



        // function move(direction) {
        //     switch (direction) {
        //         case "left":
        //             left -= 5;
        //             break;
        //         case "up":
        //             top -= 5;
        //             break;
        //         case "right":
        //             left += 5;
        //             break;
        //         case "down":
        //             top += 5
        //             break;
        //     }
        //     draw(top, left);
        // }

        // function draw(top, left) {
        //     gameCtx.clearRect(0, 0, game.width, game.height);
        //     gameCtx.drawImage(background, left, top, 250, 150, 0, 0, 250, 150);
        //     gameCtx.beginPath();
        //     gameCtx.arc(125, 75, 10, 0, Math.PI * 2, false);
        //     gameCtx.closePath();
        //     gameCtx.fill();
        //     gameCtx.stroke();
        // }

        // $("#moveLeft").click(function () {
        //     move("left");
        // });
        // $("#moveRight").click(function () {
        //     move("right");
        // });
        // $("#moveUp").click(function () {
        //     move("up");
        // });
        // $("#moveDown").click(function () {
        //     move("down");
        // });
