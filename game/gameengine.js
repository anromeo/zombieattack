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

// TIMER OBJECT START

/**
 * This is the Timer Object
 */
function Timer() {
    this.gameTime = 0; // actual game time
    this.maxStep = 0.05; // used when going away from browser, the step that the clock moves 
    this.wallLastTimestamp = 0; // the last time since the browser was in this tab
}

/**
 * This function increases the game time
 * @return returns the change in game time
 */
Timer.prototype.tick = function () {
    var wallCurrent = Date.now(); // This is the current time
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000; // current time minus last time divided by a thousand to see change in time
    this.wallLastTimestamp = wallCurrent; // wallCurrent becomes new last timestamp
    var gameDelta = Math.min(wallDelta, this.maxStep); // either difference between timestamp or the max step (used for changing tabs)
    this.gameTime += gameDelta; // incrementing the game time by delta
    return gameDelta;
}

// TIMER OBJECT END


// GAMEENGINE OBJECT START

/**
 * This is the Game Engine Object
 */
function GameEngine() {

    // Entities of the Game
    this.entities = []; // All entities of the game
    this.weapons = []; // All the weapons of the game
    // added from 435 ZOMBIE AI Project
    this.villains = []; // All the Zombies | TODO ? Get rid or change ?
    this.players = []; // All the Players | TODO ? Get rid or change ?
    this.rocks = []; // All the rocks or bullets

    // This is the x and y of the game, they control the rotation of the player
    this.x;
    this.y;

    this.map = null;

    this.zombieCooldownNumInitial = 3;  // how often a zombie will appear initially
    this.zombieCooldown = this.zombieCooldownNumInitial; // the cooldown until the next zombie appears

    this.kills = 0; // this is the number of kills that the player has total

    this.showOutlines = true; // this shows the outline of the entities
    this.ctx = null; // this is the object being used to draw on the map
    this.click = null; // this is the click value (if null, not being clicked)

    this.mouse = {x:0, y:0, mousedown:false}; // this is the mouse coordinates and whether the mouse is pressed or not

    this.surfaceWidth = null; // the width of the canvas
    this.surfaceHeight = null; // the height of the canvas

    this.windowX = 0; // This is the x-coordinate of the top left corner of the canvas currently
    this.windowY = 0; // This is the y-coordinate of the top left corner of the canvas currently

    // Quinn's Additions
    this.timer = new Timer(); // this creates the Object Timer for the Game Engine
    this.keyState = {}; // this is the current keystate which is an object that is nothing

}

GameEngine.prototype.setMap = function(map) {

    if (this.map === null) {
        // Set map
        this.map = map;

        // Adding the map walls into the game entities
        for (i = 0; i < this.map.walls.length; i++) {
            // this.entities["wall" + i] = this.map.walls[i];
            this.entities.push(this.map.walls[i]);
            console.log(("wall" + i).name);

        }

    } else {

        // Removing all of the previous maps walls
        for (i = 0; i < this.map.walls.length; i++) {
            this.entities.splice("wall" + i, 1);
        }

        // Set new map
        this.map = map;

        // Adding the map walls into the game entities
        for (i = 0; i < this.map.walls.length; i++) {
            this.entities["wall" + i] = this.map.wall[i];
        }

     }
}

/**
 * This gets the windowX which is the top left corner's X-coordinate
 * @return float representing windowX
 */
GameEngine.prototype.getWindowX = function() {
    return this.windowX;
}

/**
 * This gets the windowY which is the top left corner's Y-coordinate
 * @return float representing windowY
 */
GameEngine.prototype.getWindowY = function() {
    return this.windowY;
}

/**
 * This sets the windowX which is the top left corner's X-coordinate
 * @param x represented by a float
 */
GameEngine.prototype.setWindowX = function(x) {

    var maxX = this.worldWidth - this.surfaceWidth; // World Width minus the Canvas Width | the 1600 - 800  for forest world

    // if the X getting passed in is less than 0, then this.WindowX is less than 0
    if (x < 0) {
        // the canvas's top left corner will be set to 0, and we won't be back passed 0
        this.windowX = 0;

    // else if x is greater than the maxX
    } else if (x > maxX) {

        // then we freeze the canvas's top-left corner's X-Coordinate to the maxX
        this.windowX = maxX;
    } else {

        // we move the canvas's top-left corner with the X-Coordinate
        this.windowX = x;
    }
}

/**
 * This sets the windowY which is the top left corner's Y-coordinate
 * @param y represented by a float
 */
GameEngine.prototype.setWindowY = function(y) {

    var maxY = this.worldHeight - this.surfaceHeight; // World Height minus the Canvas Height | the 1600 - 800  for forest world

    // if the Y getting passed in is less than 0, then this.WindowY is less than 0
    if (y < 0) {
        this.windowY = 0;

    // else if y is greater than the maxY
    } else if (y > maxY) {

        // then we freeze the canvas's top-left corner's Y-Coordinate to the maxY
        this.windowY = maxY;
    } else {

        // we move the canvas's top-left corner with the Y-Coordinate
        this.windowY = y;
    }
}

/**
 * @param ctx canvas rendering object
 */
GameEngine.prototype.init = function (ctx) {

    this.ctx = ctx; // this adds the ctx object to the Game Engine

    this.surfaceWidth = this.ctx.canvas.width; // this sets the surfaceWidth to the canvas width
    this.surfaceHeight = this.ctx.canvas.height; // this sets the surfaceHeight to the canvas height 

    this.startInput();

}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

/**
 * This is where the input starts
 */
GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var that = this;

    var getXandYWithWindowOffset = function(e) {

        // e.clientX is where the mouse's x-coordinate currently is
        // Client Rectangle's Left does not change which is 8
        // This adjusts the X based off of the offset of where we moved
        var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left + that.getWindowX();

        // e.clientY is where the mouse's y-coordinate currently is
        // Client Rectangle's Top does not change which is 8
        // This adjusts the Y based off of the offset of where we moved
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top + that.getWindowY();

        // e.clientX is where the mouse's x-coordinate currently is
        var canvasx = e.clientX;

        // e.clientY is where the mouse's y-coordinate currently is
        var canvasy = e.clientY;

        // returns offset x and y as well as the current mouse's x and mouse's y
        return {x: x, y: y, canvasx: canvasx, canvasy: canvasy};
    }

    // if the ctx is set on this object
    if (this.ctx) {
        // add function to click event on canvas
        this.ctx.canvas.addEventListener("click", function(e) {

            // the click object is set to the current x and y offset as well as mouse's x and mouse's y
            that.click = getXandYWithWindowOffset(e);

            // prevents the click from doing anything else
            e.stopPropagation();
            e.preventDefault();
        }, false);
        
        // add function to mouse event on canvas
        this.ctx.canvas.addEventListener("mousemove", function(e) {

            // sets the tempmousedown to the current mousedown, which is a boolean
            var tempmousedown = that.mouse.mousedown;

            // the mouse object is set to the current x and y offset as well as mouse's x and mouse's y
            that.mouse = getXandYWithWindowOffset(e); 

            // adds back in the mouse down because it doesn't exit in the return of the getXandYWithWindowOffset(e) call
            that.mouse.mousedown = tempmousedown;

            that.x = that.mouse.x;
            that.y = that.mouse.y;

        }, false);

        // checking to see if the mouse has been released        
        this.ctx.canvas.addEventListener("mouseup", function(e) {      
            
            // mouse has been released and we set mousedown to false
            that.mouse.mousedown = false; 
        }, false);
        
        // checking to see if the mouse has been pressed
        this.ctx.canvas.addEventListener("mousedown", function(e) {

            // mouse has been pressed and we set mousedown to true
            that.mouse.mousedown = true; 
        }, false);
    }

    // adds the keydown press into the window
    window.addEventListener('keydown',function(e){
        // prevents the default event from occuring
        e.preventDefault();
        // adds the keycode key to the value in the array and sets it to true
        that.keyState[e.keyCode] = true;
    },false);

    // adds the keyup press into the window    
    window.addEventListener('keyup',function(e){
        // prevents the default event from occuring
        e.preventDefault();
        // adds the keycode key to the value in the array and sets it to false
        that.keyState[e.keyCode] = false;
    },false);

}

/**
 * This adds entities to the game.
 * No entity will be drawn or updated until it is added.
 * @param entity Object of the game
 */
GameEngine.prototype.addEntity = function (entity) {  

    this.entities.push(entity);
    // TODO Delete this!
    if (entity.name === "FlameThrower") this.weapons.push(entity);
    if (entity.type === "villain") this.villains.push(entity);
    if (entity.name === "playerControlled") this.players.push(entity);
}

/**
 * This is where the GameEngine is drawn
 * @param top
 * @param left
 */
GameEngine.prototype.draw = function (top, left) {

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // // The speed in which the canvas is moving when the player is moving
    // var ratio = 2; //1.2
    // The speed in which the canvas is moving when the player is moving

    // Changed this.worldWidth and this.worldHeight from 1600 magic numbers
    // Changed this.surfaceWidth and this.surfaceHeight from 800 magic numbers
    // The forest level that is being drawn
    this.ctx.drawImage(this.map.image, this.getWindowX() * this.map.ratio, this.getWindowY() * this.map.ratio, this.map.mapRatioHeight, this.map.mapRatioWidth, 0, 0, this.surfaceWidth, this.surfaceHeight);

    // draws the number of kills onto the canvas
    this.ctx.beginPath();
    this.ctx.fillStyle = "Red";
    this.ctx.font = "48px serif";
    var message = "Kills: " + this.kills;
    this.ctx.fillText(message, 10, 50);
    this.ctx.stroke(); 

    // this cycles through the entities that exist in the game
    for (var i = 0; i < this.entities.length; i++) {

        // then calls the draw method on the entities and passes the ctx so that they can be drawn
        this.entities[i].draw(this.ctx);
    }

    this.ctx.restore();
}

/**
 * Get the PlayerControlled Player
 */
GameEngine.prototype.getPlayer = function() {

    // For every playerControlled Object of the game, cycle through each one
    for (var i = 0; i < this.players.length; i++) {

        // If that playerControlled Object is currently being controlled
        if (this.players[i].controlled) {

            // return that player
            return this.players[i];
        }
    }

    // otherwise return null
    return null;
}

/**
 * This is the update function that updates all the entities' attributes
 */
GameEngine.prototype.update = function () {

    var entitiesCount = this.entities.length; // count of all the different entities in the game

    // Sets the player to the current player
    this.player = this.getPlayer();

    this.zombieCooldown -= this.clockTick; // decrements the zombie cooldown by the clock of the game

    // IF the zombieCooldown gets less than 0
    if (this.zombieCooldown < 0) {

        // IF there exists a player on the board
        // AND the player is not removed from world
        if (this.player && !this.player.removeFromWorld) {

            // decrease the zombieCooldownNum
            // exponentially as the distance between the player and the
            // origin of the gameboard goes down 
            var dist = distance(this.player, {x:0, y:0});
            if (dist !== 0) {

                // the half life used to project the spawn rate of the zombies.
                var halfLife = 3000;

                // the formula for the curent zombie cooldown.
                this.zombieCooldown = this.zombieCooldownNumInitial * Math.pow((1/2), dist / halfLife);
            }

            // Adds the zombie entity to the game
            var zom = new Villain(this);
            this.addEntity(zom);
        }
    }

    // cyles through all of the entities once again
    for (var i = 0; i < entitiesCount; i++) {

        var entity = this.entities[i]; // the current entity

        // if the entity is not removed from world
        if (!entity.removeFromWorld) {

            // update its attributes
            entity.update();
        }
    }

    // cyles through all of the entities backwards
    for (var i = this.entities.length - 1; i >= 0; --i) {
        // if the entities is removed from world
        if (this.entities[i].removeFromWorld) {
            // splice the array from i to 1
            this.entities.splice(i, 1);
        }
    }
    // TODO remove these two arrays; we will not be using them anymore
    for (var i = this.villains.length - 1; i >= 0; --i) {
        if (this.villains[i].removeFromWorld) {
            this.villains.splice(i, 1);
        }
    }
    for (var i = this.rocks.length - 1; i >= 0; --i) {
        if (this.rocks[i].removeFromWorld) {
            this.rocks.splice(i, 1);
        }
    }

    // this cycles through the player array backwards
    for (var i = this.players.length - 1; i >= 0; --i) {

        // if the player has been removed from the world
        if (this.players[i].removeFromWorld) {
            // if the player is currently being controlled
            if (this.players[i].controlled) {
                // cycle through the other players
                for (var j = 0; j < this.players.length; j++) {
                    // for the first player that is not removedFromWorld
                    if (!this.players[j].removeFromWorld) {
                        // swap the controls of the player and break out of the loop
                        this.players[j].controlled = true;
                        break;
                    }
                }
            }
            // then splice the players array and remove the player from this array
            this.players.splice(i, 1);
        }
    }

}

/**
 * This loops through the game engine until the game ends
 */
GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick(); // increments the clock tick
    this.update(); // updates the GameEngine and all the entities in the game
    this.draw(); // draws the GameEngine and all the entities in the game
    this.click = null; // resets the click to null
}