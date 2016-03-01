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
	this.items = [];
    this.villains = []; // All the Zombies | TODO ? Get rid or change ?
    this.players = []; // All the Players | TODO ? Get rid or change ?
    this.gameRunning = true;

    // This is the x and y of the game, they control the rotation of the player
    this.x;
    this.y;

    this.map = null;
	this.menuMode = "Start";
    this.hasSeenIntro = false;

    this.zombieCooldownNumInitial = 3;  // how often a zombie will appear initially
    this.zombieCooldown = this.zombieCooldownNumInitial; // the cooldown until the next zombie appears

    this.kills = 0; // this is the number of kills that the player has total

    this.showOutlines = false; // this shows the outline of the entities
    this.ctx = null; // this is the object being used to draw on the map
    this.click = null; // this is the click value (if null, not being clicked)

    this.mouse = {x:0, y:0, mousedown:false}; // this is the mouse coordinates and whether the mouse is pressed or not

    this.surfaceWidth = null; // the width of the canvas
    this.surfaceHeight = null; // the height of the canvas
	
	this.backgroundaudio = new Audio();
	console.log(this.backgroundaudio);
	this.backgroundaudio.loop = true;
	this.backgroundaudio.preload = "auto";

	var source= document.createElement('source');
	source.type= 'audio/ogg';
	source.src= "./sound/backgroundmusic1.ogg";
	this.backgroundaudio.appendChild(source);
	source= document.createElement('source');
	source.type= 'audio/mpeg';
	source.src= "./sound/backgroundmusic1.mp3";
	this.backgroundaudio.appendChild(source);
console.log(this.backgroundaudio);
	
    this.attributePoints = 0;
    // FOREST MAP
    // this.worldWidth = 1600; // the width of the world within the canvas FOREST
    // this.worldHeight = 1600; // the height of the world within the canvas FOREST

    // this.mapRatioWidth = 1600; //
    // this.mapRationHeight = 1600;

    // HOSPITAL MAP
    // this.worldWidth = 1400; // the width of the world within the canvas HOSPITAL
    // this.worldHeight = 1350; // the height of the world within the canvas HOSPITAL

    // this.mapRatioWidth = 400;
    // this.mapRatioHeight = 400;

    this.windowX = 0; // This is the x-coordinate of the top left corner of the canvas currently
    this.windowY = 0; // This is the y-coordinate of the top left corner of the canvas currently

    // Quinn's Additions
    this.timer = new Timer(); // this creates the Object Timer for the Game Engine
    this.keyState = {}; // this is the current keystate which is an object that is nothing

    this.expToLevelUp = 10;
    this.level = 1;
    this.expEarned = 0;

    this.menuBackground = ASSET_MANAGER.getAsset(menuBackground);
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

    var maxX = this.map.worldWidth - this.surfaceWidth; // World Width minus the Canvas Width | the 1600 - 800  for forest world

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

    var maxY = this.map.worldHeight - this.surfaceHeight; // World Height minus the Canvas Height | the 1600 - 800  for forest world

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
	this.ctx.lostfocus = "False"; //used when detecting if game lost focus.
    window.onblur = function detectLostFocus() { this.document.getElementById('gameWorld').getContext('2d').lostfocus = "True";}
	
	this.surfaceWidth = this.ctx.canvas.width; // this sets the surfaceWidth to the canvas width
    this.surfaceHeight = this.ctx.canvas.height; // this sets the surfaceHeight to the canvas height 

    this.startInput();
	this.setupGameState();
	
	this.backgroundaudio.play();	
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
		if (that.menuMode == "Game") {
			that.loop();
            // TURN ON AGAIN!!
		} else {//if (that.menuMode == "Start" || that.menuMode == "Pause") {
			that.menuLoop();
		}	
        requestAnimFrame(gameLoop, that.ctx.canvas); 
    })();
}

GameEngine.prototype.restart = function () {
	
    // Entities of the Game
    this.entities = []; // All entities of the game
    this.weapons = []; // All the weapons of the game
	this.items = [];
    // added from 435 ZOMBIE AI Project
    this.villains = []; // All the Zombies | TODO ? Get rid or change ?
    this.players = []; // All the Players | TODO ? Get rid or change ?

    // This is the x and y of the game, they control the rotation of the player
    this.x;
    this.y;

    this.map = null;
    this.expEarned = 0;
    this.expToLevelUp = 10;
    this.level = 1;

    this.kills = 0; // this is the number of kills that the player has total

    this.mouse = {x:0, y:0, mousedown:false}; // this is the mouse coordinates and whether the mouse is pressed or not
	this.keyState = {}; // this is the current keystate which is an object that is nothing

    this.windowX = 0; // This is the x-coordinate of the top left corner of the canvas currently
    this.windowY = 0; // This is the y-coordinate of the top left corner of the canvas currently   
	this.setupGameState();
	
	this.backgroundaudio.play();	
}

GameEngine.prototype.setupGameState = function () {

    // FOREST MAP
    // this.worldWidth = 1600; // the width of the world within the canvas FOREST
    // this.worldHeight = 1600; // the height of the world within the canvas FOREST

    // this.mapRatioWidth = 1600; 
    // this.mapRationHeight = 1600;

    // maps instantiated
    var hospital;
    var ruins;

    // map ratios
    var mapRatioHospitalWidth = 400;
    var mapRatioHosptialHeight = 400;
    var mapRatioTerrainWidth = 550;
    var mapRatioTerrainHeight = 550;

    if (this.surfaceHeight === 600) {
        mapRatioHosptialHeight = 300;
        mapRatioTerrainHeight = .75 * mapRatioTerrainHeight;
    }

    // maps created and assigned
    hospital = new Map(this, ASSET_MANAGER.getAsset("./images/hospital.png"), "Hospital", 1400, 1350, mapRatioHospitalWidth, mapRatioHosptialHeight, 0.5);
    ruins = new Map(this, ASSET_MANAGER.getAsset("./images/ruins.png"), "Ruins", 2285, 1500, mapRatioTerrainWidth, mapRatioTerrainHeight, 0.68);

    // adding all the walls and attractors for the hospital
    hospital.addWall(new Wall(this, 38, 460, 70, 210));
    hospital.addWall(new Wall(this, 275, 0, 95, 115));
    hospital.addWall(new Wall(this, 275, 208, 95, 240));
    hospital.addWall(new Wall(this, 489, 258, 185, 100));
    hospital.addWall(new Wall(this, 275, 540, 100, 215));
    hospital.addWall(new Wall(this, 370, 258, 385, 55));
    hospital.addWall(new Wall(this, 755, 258, 90, 364));
    hospital.addWall(new Wall(this, 845, 490, 258, 85));
    hospital.addWall(new Wall(this, 910, 450, 130, 40));
    hospital.addWall(new Wall(this, 930, 575, 100, 40));
    hospital.addWall(new Wall(this, 1103, 258, 98, 364));
    hospital.addWall(new Wall(this, 0, 0, 14000, 50));
    hospital.addWall(new Wall(this, 0, 0, 58, 12000));
    hospital.addWall(new Wall(this, 58, 752, 538, 74));
    hospital.addWall(new Wall(this, 398, 826, 168, 40));
    hospital.addWall(new Wall(this, 520, 1240, 168, 40));
    hospital.addWall(new Wall(this, 696, 752, 100, 74));
    hospital.addWall(new Wall(this, 1158, 752, 600, 74));
    hospital.addWall(new Wall(this, 793, 700, 85, 600));
    hospital.addWall(new Wall(this, 1083, 695, 75, 298));
    hospital.addWall(new Wall(this, 1083, 1086, 75, 250));
    hospital.addWall(new Wall(this, 1208, 826, 160, 63));
    hospital.addWall(new Wall(this, 1310, 1190, 300, 800));
    hospital.addWall(new Wall(this, 0, 132, 108, 210));
    hospital.addWall(new Wall(this, 0, 460, 108, 210));
    hospital.addWall(new Wall(this, 275, 0, 95, 113));
    hospital.addWall(new Wall(this, 275, 208, 95, 240));
    hospital.addWall(new Wall(this, 275, 540, 95, 280));
    hospital.addWall(new Wall(this, 275, 258, 505, 55));
    hospital.addWall(new Wall(this, 755, 258, 90, 364));
    hospital.addWall(new Wall(this, 755, 490, 447, 85));
    hospital.addWall(new Wall(this, 1103, 258, 98, 364));
    hospital.addWall(new Wall(this, 0, 752, 596, 74));
    hospital.addWall(new Wall(this, 696, 752, 160, 74));
    hospital.addWall(new Wall(this, 1083, 752, 675, 74));
    hospital.addWall(new Wall(this, 793, 700, 85, 675));
    hospital.addWall(new Wall(this, 1083, 695, 75, 298));
    hospital.addWall(new Wall(this, 1083, 1086, 75, 300));
    hospital.addWall(new Wall(this, 180, 970, 78, 400));
    hospital.addWall(new Wall(this, 0, 1280, 14000, 80));
    hospital.addAttracter(new Attracter(this, 330, 160, 45));
    hospital.addAttracter(new Attracter(this, 330, 495, 45));
    hospital.addAttracter(new Attracter(this, 645, 800, 49));
    hospital.addAttracter(new Attracter(this, 225, 895, 72));
    hospital.addAttracter(new Attracter(this, 826, 660, 39));
    hospital.addAttracter(new Attracter(this, 1182, 660, 33));
    hospital.addAttracter(new Attracter(this, 1182, 144, 70));
    hospital.addAttracter(new Attracter(this, 1123, 1040, 39));

    // adding all the ruin walls
    ruins.addWall(new Wall(this, 285, 212, 70, 210));
    ruins.addWall(new Wall(this, 285, 282, 212, 75));
    ruins.addWall(new Wall(this, 145, 355, 205, 75));
    ruins.addWall(new Wall(this, 920, 77, 65, 130));
    ruins.addWall(new Wall(this, 850, 145, 130, 68));
    ruins.addWall(new Wall(this, 785, 355, 140, 140));
    ruins.addWall(new Wall(this, 1360, -20, 60, 160));

    ruins.addWall(new Wall(this, 1360, 350, 65, 220));
    ruins.addWall(new Wall(this, 1080, 425, 420, 69));
    ruins.addWall(new Wall(this, 1425, 425, 79, 283));

    ruins.addWall(new Wall(this, 1932, 360, 65, 138));
    ruins.addWall(new Wall(this, 1932, 360, 144, 64));

    ruins.addWall(new Wall(this, 1932, 640, 70, 290));
    ruins.addWall(new Wall(this, 1932, 1078, 70, 135));
    ruins.addWall(new Wall(this, 1578, 1148, 70, 135));
    ruins.addWall(new Wall(this, 1578, 1148, 424, 65));
    ruins.addWall(new Wall(this, 1578, 1435, 70, 130));

    ruins.addWall(new Wall(this, 283, 866, 70, 355));
    ruins.addWall(new Wall(this, 283, 942, 215, 65));

    ruins.addWall(new Wall(this, 865, 935, 270, 65));
    ruins.addWall(new Wall(this, 860, 870, 140, 130));

    ruins.addWall(new Wall(this, 856, 1220, 140, 130));
    ruins.addWall(new Wall(this, 856, 1230, 65, 280));

    ruins.addWall(new Wall(this, 1286, 935, 205, 60));
    ruins.addWall(new Wall(this, 1360, 855, 140, 130));

    ruins.addWall(new Wall(this, 855, 645, 65, 65));

    ruins.addAttracter(new Attracter(this, 330, 90, 120));
    ruins.addAttracter(new Attracter(this, 70, 400, 150));

    var hospitalItems = [];
    var ruinItems = [];

    // Hospital flamethrower
    HospitalflameSpawn = [];
    HospitalflameSpawn[0] = { x: 100, y: 100 };
    HospitalflameSpawn[1] = { x: 440, y: 360 };
    HospitalflameSpawn[2] = { x: 570, y: 1150 };
    HospitalflameSpawn[3] = { x: 1020, y: 650 };
    HospitalflameSpawn[4] = { x: 980, y: 370 };

	var flamethrower = new FlameThrower(this, ASSET_MANAGER.getAsset("./images/flamethrower.png"), HospitalflameSpawn);
    hospitalItems.push(flamethrower);


    // Hospital health with spawning locations
    HospitalhealthSpawn = [];
    HospitalhealthSpawn[0] = { x: 500, y: 1150 };
    HospitalhealthSpawn[1] = { x: 1270, y: 1050 };
    HospitalhealthSpawn[2] = { x: 970, y: 335 };
	
	var healthpack = new HealthPack(this, ASSET_MANAGER.getAsset("./images/HealthPack.png"), HospitalhealthSpawn);
	hospitalItems.push(healthpack);

    // Hospital speed spawning locations
    HospitalspeedSpawn = [];
    HospitalspeedSpawn[0] = { x: 640, y: 450 };
    HospitalspeedSpawn[1] = { x: 1300, y: 700 };
    HospitalspeedSpawn[2] = { x: 1000, y: 1170 };

    var speed = new Speed(this, ASSET_MANAGER.getAsset("./images/speed.png"), HospitalspeedSpawn);
    hospitalItems.push(speed);
    hospital.setItems(hospitalItems);

    // Ruins flamethrower
    RuinflameSpawn = [];
    RuinflameSpawn[0] = { x: 1450, y: 100 };

    var flamethrower = new FlameThrower(this, ASSET_MANAGER.getAsset("./images/flamethrower.png"), RuinflameSpawn);
    ruinItems.push(flamethrower);

    // Ruins health
    RuinhealthSpawn = [];
    RuinhealthSpawn[0] = { x: 500, y: 1150 };

    var healthpack = new HealthPack(this, ASSET_MANAGER.getAsset("./images/HealthPack.png"), RuinhealthSpawn);
    ruinItems.push(healthpack);

    // Ruins speed
    RuinspeedSpawn = [];
    RuinspeedSpawn[0] = { x: 640, y: 450 };

    var speed = new Speed(this, ASSET_MANAGER.getAsset("./images/speed.png"), RuinspeedSpawn);
    ruinItems.push(speed);


    hospital.update = function() {
        if (this.startingKills === undefined) {
            this.startingKills = this.game.kills;
        }
        if (this.game.kills - this.startingKills > 19 && !this.unlocked) {
                var bossMap = new Map(this, ASSET_MANAGER.getAsset("./images/bossMap1.png"), "Boss Map - Level 1", 800, 600, 800, 600, 0.5);
                bossMap.addVillain(new Boss(this.game));
                bossMap.isBossMap = true;
                this.unlocked = true;
                this.game.addEntity(new Portal(this.game, 94, 1186, bossMap, 700, 200));
        }
    }

    var portal = new Portal(this, 1700, 1400, hospital, 200, 200);
    ruins.update = function() {

        // if (this.storyClockTick === undefined) {
        //     this.storyTimer = new Timer();
        //     this.storyClockTick = 0;
        //     this.storyClockSeconds = 0;
        //     this.storyAlpha = [];
        //     this.alpha1 = 0;
        //     this.alpha2 = 0;
        //     this.alpha3 = 0;
        //     this.alpha4 = 0;
        //     this.alpha5 = 0;
        // }

        if (this.randomKillNumber === undefined) {
            this.randomKillNumber = 10 + randomInt(10);
            this.keyNeedsAdding = true;
        }
        if (this.game.kills === this.randomKillNumber && this.keyNeedsAdding && this.game.lastVillainKilledX) {

            for (var i = 0; i < 20; i++) {
                this.game.addEntity(new Villain(this.game));
            }
            this.game.addEntity(new Key(this.game, 1200, 800, portal));
            this.keyNeedsAdding = false;
        }
    }
         // this.setMap(hospital);
    ruins.setItems(ruinItems);
   this.setMap(ruins);

    // this.setItems(hospitalItems);

    // this.addEntity(new Portal(this, 800, 600, hospital, 200, 200));

	
	var player = new playerControlled(this);
    player.controlled = true;
    this.addEntity(player);

    // var player2 = new playerControlled(this);
    // this.addEntity(player2);

    // var bossMap = new Map(this, ASSET_MANAGER.getAsset("./images/bossMap1.png"), "Boss Map - Level 1", 800, 800, 800, 800, 0.5);
    // bossMap.addVillain(new Boss(this));
    // bossMap.isBossMap = true;

    // this.addEntity(new Portal(this, 94, 1186, bossMap, 700, 200));
//    this.setMap(bossMap);
    // var player2 = new playerControlled(this);
    // this.addEntity(player2);

    // var player3 = new playerControlled(this);
    // this.addEntity(player3);

    
    //this.addEntity(boss);
  //  this.addEntity(background);

  //  this.addEntity(player2);   
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
	if (entity.type === "item") this.items.push(entity);
    if (entity.type === "villain") this.villains.push(entity);
    if (entity.name === "playerControlled") this.players.push(entity);
}

/**
 * Draws the Experience Bar
 */
GameEngine.prototype.drawExperience = function() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "blue";
    this.ctx.font = "bolder 20px Arial";
    var message1 = "Level: " + this.level;
    this.ctx.fillText(message1, this.surfaceWidth - 185 - 80, 30);
    
    

    this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.surfaceWidth - 185, 10, 170, 25);

    this.ctx.beginPath();
    this.ctx.strokeStyle = "red";
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.surfaceWidth - 180, 15, 160, 15);

    var calculatewidth = this.expEarned / this.expToLevelUp;
    this.ctx.beginPath();
    this.ctx.strokeStyle = "blue";
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(this.surfaceWidth - 180, 15, 160 * calculatewidth, 15);
    this.ctx.stroke(); 
    this.ctx.restore();
}

/**
 * Draws the kill score
 */
GameEngine.prototype.drawScore = function() {
    // draws the number of kills onto the canvas
    this.ctx.beginPath();
    this.ctx.fillStyle = "red";
    this.ctx.font = "48px serif";
    var message = "Kills: " + this.kills;
    this.ctx.fillText(message, 10, 50);
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

    // Uses the current map image
    // Uses the current map's ratio, mapRatioHeight, mapRatioWidth to deterine map
    // Changed this.worldWidth and this.worldHeight from 1600 magic numbers
    // Changed this.surfaceWidth and this.surfaceHeight from 800 magic numbers
    // The forest level that is being drawn
    this.ctx.drawImage(this.map.image, this.getWindowX() * this.map.ratioX, this.getWindowY() * this.map.ratioY, this.map.mapRatioWidth, this.map.mapRatioHeight, 0, 0, this.surfaceWidth, this.surfaceHeight);



    if (this.showOutlines) {
        // this cycles through the walls of the map
        for (var i = 0; i < this.map.walls.length; i++) {
            // to draw them
            this.map.walls[i].draw(this.ctx);
        }
        for (var i = 0; i < this.map.attracters.length; i++) {
            this.map.attracters[i].draw(this.ctx);
        }
    }

    // this cycles through the entities that exist in the game
    for (var i = 0; i < this.entities.length; i++) {

        // then calls the draw method on the entities and passes the ctx so that they can be drawn
        this.entities[i].draw(this.ctx);
    }

    this.drawScore();
    this.drawExperience();
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


    // this cycles through the walls to check for collissions
    for (var i = 0; i < this.map.attracters.length; i++) {
        // to draw them
        this.map.attracters[i].update();
    }

    // Sets the player to the current player
    this.player = this.getPlayer();

    if(this.expToLevelUp <= this.expEarned){
        this.gameRunning = false;
        ++this.level;
        this.expToLevelUp *= 2;
        this.expEarned = 0;
        this.attributePoints += 5;
    }

    // If the map is not a BossMap
    if (!this.map.isBossMap) {
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
            //check if you defeated the boss
			if (this.entities[i].name == "FinalBoss") {
				this.menuMode = "Win";
			}
			// splice the array from i to 1
			this.entities.splice(i, 1);
        }
    }

    // cycles through all the villains entities backwards
    for (var i = this.villains.length - 1; i >= 0; --i) {
        if (this.villains[i].removeFromWorld) {
            var villain = this.villains[i];
            this.lastVillainKilledX = villain.x - villain.radius - this.getWindowX();

            this.lastVillainKilledY = villain.y - villain.radius - this.getWindowY();
            this.villains.splice(i, 1);


            // this.movingAnimation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius - this.game.getWindowX() - this.radialOffset, this.y - this.radius - this.game.getWindowY() - this.radialOffset, this.angle);


            //console.log(this.lastVillainKilledX);
            //console.log(this.lastVillainKilledY);
        }
    }

    // cycles through all the items entities backwards
    for (var i = this.items.length - 1; i >= 0; --i) {
        if (this.items[i].removeFromWorld) {
            this.items.splice(i, 1);
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

    // this cycles through the walls to check for collisions
    for (var i = 0; i < this.map.walls.length; i++) {
        // to draw them
        this.map.walls[i].update();
    }

	//if the players array is empty it is game over you lose
	if (this.players.length == 0) {
		this.menuMode = "Lose";
	}
	
}

GameEngine.prototype.setItems = function(Items) {

        // Removes all old items 
       for (var i = 0; i < this.items.length; i++) {
            // Sets the remove from world for all weapons to true
            this.items[i].removeFromWorld = true;
       }
       // Sets all new items
        for (var i = 0; i < Items.length; i++) {
            console.log(Items[i].name);
            // Sets the remove from world for all weapons to true
            this.addEntity(Items[i]);
            this.items.push(Items[i]);
       }

}


GameEngine.prototype.setMap = function(map, portal) {
    this.map = map;

    if (this.map !== null) {
       // Removes all the previous villains
       for (var i = 0; i < this.villains.length; i++) {
           // Sets the remove from world for all villains to true
           this.villains[i].removeFromWorld = true;
       }

       // Removes all the previous weapons
       for (var i = 0; i < this.weapons.length; i++) {
            // Sets the remove from world for all weapons to true
            this.weapons[i].removeFromWorld = true;
       }
    }

    // IF there are players in this game
    if (this.players.length > 0 && portal) {
        // set the current player to the portal's Enter X and Enter Y
        var player = this.getPlayer();
        player.x = portal.enterX;
        player.y = portal.enterY;
        player.canvasX = portal.enterX;
        player.canvasY = portal.enterY;
    }

    // Add Villains from Map into the game
    for (var i = 0; i < this.map.villains.length; i++) {
        // Add Villains from Map into the game
        this.addEntity(this.map.villains[i]);
    }

    // Adds Weapons from Map into the game
    for (var i = 0; i < this.map.weapons.length; i++) {
        // Add Weapons from Map into the game
        this.addEntity(this.map.weapons[i]);
    }

    this.setItems(this.map.items);
}

GameEngine.prototype.drawStory = function() {
    if (this.storyClockTick === undefined) {
        this.storyTimer = new Timer();
        this.storyClockTick = 0;
        this.storyClockSeconds = 0;
        this.storyAlpha = [];
        this.alpha1 = 0;
        this.alpha2 = 0;
        this.alpha3 = 0;
        this.alpha4 = 0;
        this.alpha5 = 0;
    }
    var previousStoryClockTick = this.storyClockTick;
    this.storyClockTick += this.storyTimer.tick();
    if (this.storyClockTick > this.storyClockSeconds) {
        this.storyClockSeconds++;
    }
    var incrementTime = (this.storyClockTick - previousStoryClockTick) / 2;
    var scene2 = 20;
    var scene3 = 30;
    var indent = 70;

    this.skipIntroButton = {x:this.surfaceWidth - 100, y: this.surfaceHeight - 75, height:50, width:75};    

    this.skipIntroButton.lines = ["Skip"];
    this.drawButton(this.skipIntroButton, "transparent");

    if (this.storyClockSeconds > 1) {
        if (this.alpha1 < 1 && this.storyClockSeconds < scene2) {
            this.alpha1 += incrementTime;
        } else if (this.storyClockSeconds > scene2) {
            this.alpha1 -= incrementTime;
        }
        this.drawMessage("It was a warm day when Tristan and his son, Danny, went on ", indent, 90, "rgba(0, 0, 0, " + this.alpha1 + ")");
        this.drawMessage("their father-son fishing trip. In the early morning, they rested in", indent, 130, "rgba(0, 0, 0, " + this.alpha1 + ")");
        this.drawMessage("their boat with their lines set, laughing and bonding. The sun ", indent, 170, "rgba(0, 0, 0, " + this.alpha1 + ")");
        this.drawMessage("was shining, and the birds were singing. It was a perfect day.", 70, 210, "rgba(0, 0, 0, " + this.alpha1 + ")");
    }
    if (this.storyClockSeconds > 8) {
        if (this.alpha2 < 1 && this.storyClockSeconds < scene2) {
            this.alpha2 += incrementTime;
        } else if (this.storyClockSeconds > scene2) {
            this.alpha2 -= incrementTime;
        }
        // // Fade In
        this.drawMessage("Too perfect...", 70, 255, "rgba(0, 0, 0, " + this.alpha2 + ")");
    }
    if (this.storyClockSeconds > 11) {
        if (this.alpha3 < 1 && this.storyClockSeconds < scene2) {
            this.alpha3 += incrementTime;
        } else if (this.storyClockSeconds > scene2) {
            this.alpha3 -= incrementTime;
        }
        // // Fade In 2
        this.drawMessage("Something began to bother Tristan. His instincts for danger", 70, 300, "rgba(0, 0, 0, " + this.alpha3 + ")");
        this.drawMessage("had been quite developed from his time as an Army Ranger. He", 70, 340, "rgba(0, 0, 0, " + this.alpha3 + ")");
        this.drawMessage("could feel the hairs on the back of his neck stand. That’s", 70, 380, "rgba(0, 0, 0, " + this.alpha3 + ")");
        this.drawMessage("when he saw the red wave of energy surging through the air;", 70, 420, "rgba(0, 0, 0, " + this.alpha3 + ")");
        this.drawMessage(" he knew right away there was no escape. He reached out for", 70, 460, "rgba(0, 0, 0, " + this.alpha3 + ")");
        this.drawMessage("Danny’s hand a moment too late. The energy rocked the water,", 70, 500, "rgba(0, 0, 0, " + this.alpha3 + ")");
        this.drawMessage("flinging the boat high into the air.", 70, 540, "rgba(0, 0, 0, " + this.alpha3 + ")");
    }
    if (this.storyClockSeconds > scene2 + 2) {
        if (this.alpha4 < 1 && this.storyClockSeconds < scene3) {
            this.alpha4 += incrementTime;
        }
        this.drawMessage("Tristan felt the lake’s cold embrace take him under. A moment", 70, 90, "rgba(0, 0, 0, " + this.alpha4 + ")");
        this.drawMessage("later, he felt a strike to the head, and the darkness took him.", 70, 130, "rgba(0, 0, 0, " + this.alpha4 + ")");
        this.drawMessage("The next time he awoke, he found himself on the shore of the", 70, 170, "rgba(0, 0, 0, " + this.alpha4 + ")");
        this.drawMessage("lake with Danny nowhere to be seen. For hour after hour,", 70, 210, "rgba(0, 0, 0, " + this.alpha4 + ")");
        this.drawMessage("he searched with no luck.", 70, 250, "rgba(0, 0, 0, " + this.alpha4 + ")");
    }
    if (this.storyClockSeconds > scene2 + 6) {
        if (this.alpha5 < 1 && this.storyClockSeconds < scene3) {
            this.alpha5 += incrementTime;
        }
        this.drawMessage("Finally, he decided to make his way into the closest town,", 70, 310, "rgba(0, 0, 0, " + this.alpha5 + ")");
        this.drawMessage("praying someone there could help him…", 70, 350, "rgba(0, 0, 0, " + this.alpha5 + ")");
    }
    if (this.alpha5 > 1) {
        var width = 220;
        var height = 50;
        //startButton
        this.beginButton = {x:this.ctx.canvas.width/2 - width/2, y: 390, height:height, width:width};    

        this.beginButton.lines = ["Save Danny!"];
        this.drawButton(this.beginButton);
    }
}
GameEngine.prototype.drawStartMenu = function() {
        var height = 50;
        var width = 200;
        
        if (this.surfaceHeight == 600) {
            this.drawMessage("Find the key after killing some zombies!", 180, 80);
            this.drawMessage("Get through the first portal!", 250, 120);
            this.drawMessage("Then get 20 kills, walk through the portal and kill the boss to win!", 40, 160);
            this.drawMessage("Make sure to get the flamethrower before going through the portal!", 40, 200);

            this.drawMessage("Walk with WASD", 305, 400);
            this.drawMessage("Use mouse to rotate player", 265, 440);
            this.drawMessage("Click mouse to shoot", 285, 480);        
        } else {
            this.drawMessage("Get 20 kills, walk through the portal and kill the boss to win!", 70, 288);
            this.drawMessage("Make sure to get the flamethrower before going through the portal!", 40, 330);

            this.drawMessage("Walk with WASD", 305, 490);
            this.drawMessage("Use mouse to rotate player", 265, 540);
            this.drawMessage("Click mouse to shoot", 285, 590);
            
        }
        //startButton
        this.startButton = {x:this.ctx.canvas.width/2 - width/2, y:this.ctx.canvas.height/2 - height/2, height:height, width:width};    

        this.startButton.lines = ["New Game"];
        this.drawButton(this.startButton);
}

GameEngine.prototype.drawPauseMenu = function() {
    var height = 50;
    var width = 200;
        
    //startButton
    this.continueButton = {x:this.ctx.canvas.width/2 - width/2, y:this.ctx.canvas.height/2 - height/2, height:height, width:width}; 
    this.continueButton.lines = ["Continue"];
        
    var buttX = this.continueButton.x;//this.ctx.canvas.width/2 - width/2; 
    var buttY = this.continueButton.y + this.continueButton.height + 30;
    this.startButton = {x:buttX, y:buttY, height:height, width:width};  
    this.startButton.lines = ["New Game"];
        
    this.drawButton(this.continueButton);
    this.drawButton(this.startButton);
}

GameEngine.prototype.drawLoseMenu = function() {
    //console.log("lost game");
    var width = 200;
    var height = 400 - 100;
    
    if (this.surfaceHeight === 600) {
        height -= 100;
    } 
    this.drawMessage ("GAME OVER", width + 127, height + 30);
    this.drawMessage ("YOU LOST!", width + 135, height + 60);
        
    height = 50;
    width = 200;
        
    //okButton
    this.okButton = {x:this.ctx.canvas.width/2 - width/2, y:this.ctx.canvas.height/2 - height/2, height:height, width:width};   
    this.okButton.lines = ["Ok"];
    this.drawButton(this.okButton);
}

GameEngine.prototype.drawWinMenu = function() {
    var width = 200;
    var height = 400 - 100;
    
    if (this.surfaceHeight === 600) {
        height -= 100;
    }

    this.drawMessage ("GAME OVER", width + 127, height + 30);
    this.drawMessage ("You Win!!", width + 151, height + 60);
        
    height = 50;
    width = 200;
        
    this.okButton = {x:this.ctx.canvas.width/2 - width/2, y:this.ctx.canvas.height/2 - height/2, height:height, width:width};   
    this.okButton.lines = ["Ok"];
    this.drawButton(this.okButton);
}

GameEngine.prototype.drawMenu = function() {
	this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    if (this.surfaceHeight == 600) {
        this.ctx.drawImage(this.menuBackground, 0, 0, this.surfaceWidth, this.surfaceHeight, 0, 0, this.surfaceWidth, this.surfaceHeight);
    }

	if (this.menuMode == "Start") {
        this.drawStartMenu();
	} else if (this.menuMode == "Pause") {
        this.drawPauseMenu();
	} else if (this.menuMode == "Lose") {
        this.drawLoseMenu();
	} else if (this.menuMode == "Win") {
        this.drawWinMenu();
	} else if (this.menuMode == "Storymode") {
        this.drawStory();
    }
}

GameEngine.prototype.drawMessage = function(messageToDraw, startX, startY, color, font) {
	//console.log("color " + color);
		this.ctx.save();
        if (color === undefined) {
            if (this.surfaceHeight === 600) {
                this.ctx.fillStyle = "black";
            } else {
		        this.ctx.fillStyle = "white";
            }
        } else {
            this.ctx.fillStyle = color;
        }
        if (font === undefined) {
            if (this.surfaceHeight === 600) {
                this.ctx.font = "24px Georgia";
            } else {
		        this.ctx.font="25px Arial";
            }
        } else {
            this.ctx.font = font;
        }
		//console.log("this.ctx.fillStyle" + this.ctx.fillStyle);
		this.ctx.fillText(messageToDraw, startX, startY);
}

GameEngine.prototype.drawButton = function(buttonToDraw, fillColor, textColor) {
	//console.log("fillcolor" + fillColor);
	//console.log("textColor" + textColor);
	this.ctx.save();
	
	this.ctx.beginPath();
    if (fillColor === undefined) {
        this.ctx.fillStyle = "blue";
    } else {
        this.ctx.fillStyle = fillColor;        
    }
    this.ctx.fillRect(buttonToDraw.x, buttonToDraw.y, buttonToDraw.width, buttonToDraw.height);
    this.ctx.fill();
    this.ctx.closePath();
	
	this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.rect(buttonToDraw.x, buttonToDraw.y, buttonToDraw.width, buttonToDraw.height);
    this.ctx.stroke();
    this.ctx.closePath();
	
    if (textColor === undefined) {
	   this.ctx.fillStyle = "white";
    } else {
        this.ctx.fillStyle = textColor;
    }
	this.ctx.font="25px Arial";

	for (var i = 0; i < buttonToDraw.lines.length; i++) {
		var startX = buttonToDraw.x + buttonToDraw.width/2 - (buttonToDraw.lines[i].length/2 * 15);
		var startY = buttonToDraw.y + (33 * (i + 1));
		this.ctx.fillText(buttonToDraw.lines[i], startX, startY);
	};
	
	// this.ctx.beginPath();
    // this.ctx.fillStyle = "orange";
    // this.ctx.fillRect(buttonToDraw.x, buttonToDraw.y, 5, 5);
    // this.ctx.fill();
    // this.ctx.closePath();
	
	// this.ctx.fillText(line1,this.startButton.x + 32,this.startButton.y + 30);	
	// this.ctx.fillText(line2,this.startButton.x + 35,this.startButton.y + 60);
	// this.ctx.fillText(line3,this.startButton.x + 38,this.startButton.y + 90);
    this.ctx.restore();
}

GameEngine.prototype.checkMenuClick = function (buttonToTest){
    // console.log("X: " + this.click.canvasx + " | Y:" + this.click.canvasy);
	return(this.click.canvasx >= buttonToTest.x && this.click.canvasx <= buttonToTest.x + buttonToTest.width && this.click.canvasy >= buttonToTest.y && this.click.canvasy <= buttonToTest.y + buttonToTest.height)
}

// GameEngine.prototype.checkMenuClick = function (x, y, width, height){
	// console.log(this.click.x >= x);
	// console.log(this.click.x <= x + width);
	// console.log(this.click.y >= y);
	// console.log(this.click.y <= y + height);
	// return(this.click.x >= x && this.click.x <= x + width && this.click.y >= y && this.click.y <= y + height)
// }

// function printout() {
    // console.log("printout called");
// }

GameEngine.prototype.menuLoop = function () {
	//console.log(window);
	//console.log(document);
	//console.log(window.onblur);
	//window.onblur = function setMenuMode() { console.log("printout called");}
	//window.onblur = function setMenuMode() { console.log(this.document.getElementById('gameWorld').getContext('2d'));console.log(this.document.getElementById('gameWorld').getContext('2d').test = "now");console.log("printout called");}
		//window.onblur = function setMenuMode() { this.menuMode = "Pause";console.log("printout called");}

	// console.log(document.getElementById('gameWorld'));
	// console.log(document.getElementById('gameWorld').style);
	//console.log(document.getElementById('gameWorld').style.cursor = 'pointer');
	document.getElementById('gameWorld').style.cursor = 'pointer';
	//console.log(document.getElementById('gameWorld')._proto_;
	this.drawMenu();
	
	//if there is a click, see if it clicked a button
	//console.log(this.click);
	if (this.click != null) {
		//console.log(this.click);
		//console.log(this.menuMode);
		if (this.menuMode == "Start") {
			//console.log(this.checkMenuClick(this.startButton));
			//console.log(this.click);
			//console.log(this.startButton);
			if (this.checkMenuClick(this.startButton)){
				//console.log("should be starting");
				this.restart();
				document.getElementById('gameWorld').style.cursor = '';
                if (this.hasSeenIntro) {
    				this.menuMode = "Game";
                } else {
                    this.menuMode = "Storymode";
                }
			}
			// } else if (this.checkMenuClick(this.restartButton)){
				// this.restart();
				// console.log(document.getElementById('gameWorld').style.cursor = 'url("./images/cursor.png")');
				// this.menuMode = "Game";
			// }
		} else if (this.menuMode == "Pause") {
			if (this.checkMenuClick(this.continueButton)){
				//console.log("should be continuing");
				this.backgroundaudio.play();	
				document.getElementById('gameWorld').style.cursor = '';
				this.menuMode = "Game";
			} else if (this.checkMenuClick(this.startButton)){
				//console.log("should be restarting");
				this.restart();
				this.backgroundaudio.play();	
				document.getElementById('gameWorld').style.cursor = '';
				this.menuMode = "Game";
			}
		} else if (this.menuMode == "Lose" || this.menuMode == "Win") {
			if (this.checkMenuClick(this.okButton)){								
				this.menuMode = "Start";
			}
        } else if (this.menuMode == "Intro") {

		} else if (this.menuMode == "EndLevel") {
			if (this.checkMenuClick(this.okButton)){
				//increment level
			}
		} else if (this.menuMode == "Storymode") {
            if ((this.beginButton && this.checkMenuClick(this.beginButton)) ||
            (this.skipIntroButton && this.checkMenuClick(this.skipIntroButton))) {
                this.menuMode = "Game";
				this.backgroundaudio.play();	
                document.getElementById('gameWorld').style.cursor = '';
            }
        }
		
	}
	

	// if (this.click != null) {
		// //console.log(this.click);
		// if (this.checkMenuClick(this.startButton)){
			// this.menuMode = "Game";
		// }
		// // if (this.click.x >= this.startButton.x && 
		// // this.click.x <= this.startButton.x + this.startButton.width &&
		// // this.click.y >= this.startButton.y && 
		// // this.click.y <= this.startButton.y + this.startButton.height) {
			
			// // //this.showMenu = false;
			// // //this.FirstMenu = false;
			// // //this.reset();
		// // }
	// }
    //this.clockTick = this.timer.tick(); // increments the clock tick
    //this.update(); // updates the GameEngine and all the entities in the game
    //this.draw(); // draws the GameEngine and all the entities in the game
    this.click = null; // resets the click to null
}

GameEngine.prototype.drawPlayerView = function(index, player) {

    var borderWidth = 10;
    var ctx = this.ctx;
    var startX = (index + 1) * 25 + (index * (this.surfaceWidth / 3 - 20));
    var startY = 25;
    var width = this.surfaceWidth / 3 - 20;
    var height = this.surfaceHeight - 200;

    ctx.fillStyle = "#3a3a3a";
    roundRect(ctx, startX - borderWidth, startY - borderWidth, width + borderWidth * 2, height + borderWidth * 2, 5, true, true);
    
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.fillStyle = "#464646";
    ctx.fillRect(startX, startY, width, height);
    ctx.stroke();

    var indent = startX + 20;
    var currentHeight = startY + 30;
    this.drawMessage(player.name, indent, currentHeight);
    var canAddAttributePoints = this.attributePoints > 0;
    var addColor = "#464646";
    if (canAddAttributePoints) {
        addColor = "green";
    }

    currentHeight += 50;

    if (canAddAttributePoints) {
        this.drawMessage("Points Available: +" + this.attributePoints, indent, currentHeight, "red", "20px Arial");
    }

    currentHeight += 50;
    this.drawMessage("Strength " + player.strength, indent + 60, currentHeight);
    this.addButtonStrength = {x: indent, y: currentHeight - 35, height: 50, width: 50};
    this.addButtonStrength.lines = ["+"];
    this.drawButton(this.addButtonStrength, addColor);
    if (this.click && this.checkMenuClick(this.addButtonStrength) && canAddAttributePoints) {
        this.attributePoints -= 1;
        player.strength += 1;
    }

    currentHeight += 70;
    this.drawMessage("Vitality " + player.vitality, indent + 60, currentHeight);
    this.addButtonVitality = {x: indent, y: currentHeight - 35, height: 50, width: 50};
    this.addButtonVitality.lines = ["+"];
    this.drawButton(this.addButtonVitality, addColor);
    if (this.click && this.checkMenuClick(this.addButtonVitality) && canAddAttributePoints) {
        this.attributePoints -= 1;
        player.vitality += 1;
        player.health += 4;
        player.healthMAX = player.vitality * 4;
    }


    currentHeight += 70;
    this.drawMessage("Speed " + player.speed, indent + 60, currentHeight);
    this.addButtonSpeed = {x: indent, y: currentHeight - 35, height: 50, width: 50};
    this.addButtonSpeed.lines = ["+"];
    this.drawButton(this.addButtonSpeed, addColor);
    if (this.click && this.checkMenuClick(this.addButtonSpeed) && canAddAttributePoints) {
        this.attributePoints -= 1;
        player.speed += 1;
        player.maxSpeed = player.speed * 4;
    }


    // this.addButtonVitality = {x:};
    // this.addButtonSpeed = {x:};

    //okButton
    this.doneButton = {x:indent, y: startY + height - 60, height:50, width:200};   
    this.doneButton.lines = ["Ok"];
    this.drawButton(this.doneButton);
    if (this.click && this.checkMenuClick(this.doneButton)) {
        this.gameRunning = true;
    }

}

/**
 * This loops through the game engine until the game ends
 */
GameEngine.prototype.loop = function () {
	//pauses the game if game looses focus
	// if (this.click != null) {
		// console.log(this.click);
	// }

	if (this.ctx.lostfocus == "True") {
		//console.log("lostfocus");
		this.ctx.lostfocus = "False";
		this.backgroundaudio.pause();
		this.menuMode = "Pause";
	}
    if (this.gameRunning) {
        this.clockTick = this.timer.tick(); // increments the clock tick

        this.update(); // updates the GameEngine and all the entities in the game

    	this.draw(); // draws the GameEngine and all the entities in the game
    } else {
        for (var i = 0; i < this.players.length; i++) {
            this.drawPlayerView(i, this.players[i]);
        }
    }

    this.click = null; // resets the click to null
	
	this.backgroundaudio.play();
    this.map.update();

}