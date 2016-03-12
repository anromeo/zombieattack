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

    this.allMaps = [];
    // Entities of the Game
    this.entities = []; // All entities of the game
    this.weapons = []; // All the weapons of the game
    this.items = [];
    this.villains = []; // All the Zombies | TODO ? Get rid or change ?
    this.players = []; // All the Players | TODO ? Get rid or change ?
    this.gameRunning = true;
    this.musicPlaying = true;
    this.deadPlayers = [];

    // This is the x and y of the game, they control the rotation of the player
    this.x;
    this.y;

    this.map = null;
    //this.menuMode = "Game";
    this.menuMode = "Start";
    this.hasSeenIntro = false;

    this.zombieCooldownNumInitial = 3;  // how often a zombie will appear initially
    this.zombieCooldown = this.zombieCooldownNumInitial; // the cooldown until the next zombie appears
    
    
    this.spiderCooldownNumInitial = 2; // how often a spider will appear
    this.spiderCooldown = this.zombieCooldownNumInitial; // the cooldown until the next spider appears
    
    this.skeletonCooldownNumInitial = 4; // how often a skeleton will appear
    this.skeletonCooldown = this.zombieCooldownNumInitial; // the cooldown until the next skeleton appears

    this.kills = 0; // this is the number of kills that the player has total

    this.showOutlines = false; // this shows the outline of the entities
    this.ctx = null; // this is the object being used to draw on the map
    this.click = null; // this is the click value (if null, not being clicked)

    this.mouse = {x:0, y:0, mousedown:false}; // this is the mouse coordinates and whether the mouse is pressed or not

    this.surfaceWidth = null; // the width of the canvas
    this.surfaceHeight = null; // the height of the canvas

    // var source= document.createElement('source');
    // source.type= 'audio/ogg';
    // source.src= "./sound/backgroundmusic1.ogg";
    // this.backgroundaudio.appendChild(source);
    // source= document.createElement('source');
    // source.type= 'audio/mpeg';
    // source.src= "./sound/fastfoot.mp3";
    // this.backgroundaudio.appendChild(source);
 //    console.log(this.backgroundaudio);
    this.setupSounds();

    
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
    this.aura = false;

    this.maxHalo = 10;
    this.halo = this.maxHalo;
}

GameEngine.prototype.restoreSpeeds = function () {
    for (var i = 0; i < this.entities.length; i++) {
        var other = this.entities[i];
        if (!other.isNonLiving && other.team != this.getPlayer().team && other.oldSpeed) {
            other.maxSpeed = other.oldSpeed;
            other.cooldown = other.oldCooldown;
            if (other.movingAnimation) {
                other.movingAnimation.frameDuration = other.movingAnimationOld;
            }
            if (other.attackAnimation) {
                other.attackAnimation.frameDuration = other.attackAnimationOld;                        
            }
            other.oldSpeed = false;
        }
        if (!other.isNonLiving && other.team != this.getPlayer().team && other.frozen) {
            if (other.movingAnimation) {
                other.movingAnimation.frozen = false;
            }
            if (other.attackAnimation) {
                other.attackAnimation.frozen = false;                        
            }
            other.frozen = false;
        }

    }
}
GameEngine.prototype.setupSounds = function () {
    this.backgroundaudio = new Audio();
    //console.log(this.backgroundaudio);
    this.backgroundaudio.loop = true;
    this.backgroundaudio.preload = "auto";

    // var source= document.createElement('source');
    // source.type= 'audio/ogg';
    // source.src= "./sound/backgroundmusic1.ogg";
    // this.backgroundaudio.appendChild(source);
    source = document.createElement('source');
    source.type= 'audio/mpeg';
    source.src= "./sound/FastFoot.mp3";
    //source.src= "./sound/backgroundmusic1.mp3";
    this.backgroundaudio.appendChild(source);
    //console.log(this.backgroundaudio);
    
    this.gunaudio = new Audio();
    //console.log(this.backgroundaudio);
    this.gunaudio.loop = true;
    this.gunaudio.preload = "auto"; 
    sourceGunAudio = document.createElement('source');
    sourceGunAudio.type= 'audio/mpeg';
    sourceGunAudio.src= "./sound/MachineGun3.mp3";
    //sourceGunAudio.src= "./sound/GunShot.mp3";
    this.gunaudio.appendChild(sourceGunAudio);
    //this.gunaudio.pause();
    
    this.flameaudio = new Audio();
    this.flameaudio.loop = true;
    this.flameaudio.preload = "auto";   
    sourceflameaudio = document.createElement('source');
    sourceflameaudio.type= 'audio/mpeg';
    sourceflameaudio.src= "./sound/Firestrm.mp3";
    this.flameaudio.appendChild(sourceflameaudio);
    //this.gunaudio.pause();
    
    this.explosionaudio = new Audio();
    this.explosionaudio.loop = false;
    this.explosionaudio.preload = "auto";   
    sourceexplosionaudio = document.createElement('source');
    sourceexplosionaudio.type= 'audio/mpeg';
    sourceexplosionaudio.src= "./sound/Explosion.mp3";
    this.explosionaudio.appendChild(sourceexplosionaudio);
    
    this.endaudio = new Audio();
    this.endaudio.loop = false;
    this.endaudio.preload = "auto"; 
    sourceendaudio = document.createElement('source');
    sourceendaudio.type= 'audio/mpeg';
    sourceendaudio.src= "./sound/wickedmalelaugh1.mp3";
    this.endaudio.appendChild(sourceendaudio);
    
    this.winaudio = new Audio();
    this.winaudio.loop = false;
    this.winaudio.preload = "auto"; 
    sourcewinaudio = document.createElement('source');
    sourcewinaudio.type= 'audio/mpeg';
    sourcewinaudio.src= "./sound/whahoo.mp3";
    this.winaudio.appendChild(sourcewinaudio);
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
    if (this.musicPlaying) {
        this.backgroundaudio.play();
    }
        
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
    console.log("restart");
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
    if (this.musicPlaying) {
        this.backgroundaudio.play();
    }
        
}

GameEngine.prototype.generateRandomItem = function(x, y) {
    var random = randomInt(3);
    var item = null;
    switch (random) {
        case 0: 
            item = new HealthPack(this, ASSET_MANAGER.getAsset("./images/HealthPack.png"), [], x, y);
        break;
        case 1:
            item = new FlameThrower(this, ASSET_MANAGER.getAsset("./images/flamethrower.png"), [], x, y);
        break;
        case 2:
            item = new Speed(this, ASSET_MANAGER.getAsset("./images/speed.png"), [], x, y);
        break;
    }
    return item;
}

GameEngine.prototype.setupGameState = function () {
    this.setupMaps();
    

        var player = new playerControlled(this);
        player.inplay = true;
        player.controlled = true;
        this.addEntity(player);

    //this.setMap(this.allMaps["ruins"]);
        this.setMap(this.allMaps["ruins"]);
    //this.setMap(this.allMaps["map1"]);
    //this.menuMode = "Game";
    this.menuMode = "Start";
    
    
}

GameEngine.prototype.setupMaps = function () {

    // FOREST MAP
    // this.worldWidth = 1600; // the width of the world within the canvas FOREST
    // this.worldHeight = 1600; // the height of the world within the canvas FOREST

    // this.mapRatioWidth = 1600; 
    // this.mapRationHeight = 1600;

    // maps instantiated
    var hospital;
    var ruins;
    var map1;
    var factory;
    var smallRoom;
    var city;

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
    map1 = new Map(this, ASSET_MANAGER.getAsset("./images/map1.png"), "map1", 2295, 1800, 400, 300, 0.50);

    //map1.isBossMap = true;
    ruins.spawnPoints =[{ x: 1360, y: 652 },
                        { x: 1231, y: 322 },
                        { x: 1338, y: 80 },
                        { x: 939, y: 965 },
                        { x: 1027, y: 1225 },
                        { x: 752, y: 1250 },
                        { x: 2200, y: 1200 },
                        { x: 1248, y: 1221 }];

    map1.isBossMap = true;
    map1.addWall(new Wall(this, 0, 0,2400,40));
    map1.addWall(new Wall(this, 950, 0,190,100));
    map1.addWall(new Wall(this, 1430, 0,30,360));
    map1.addWall(new Wall(this, 1440, 520,30,200));
    map1.addWall(new Wall(this, 1440, 820,30,100));
    map1.addWall(new Wall(this, 1380, 880,470,40));
    map1.addWall(new Wall(this, 1720, 880,30,120));
    map1.addWall(new Wall(this, 1720, 1080,30,180));
    map1.addWall(new Wall(this, 1720, 1130,230,30));
    map1.addWall(new Wall(this, 1925, 1065,185,30));
    map1.addWall(new Wall(this, 1925, 1065,30,95));
    map1.addWall(new Wall(this, 2085, 1030,30,150));
    map1.addWall(new Wall(this, 2240, 1250,30,425));
    map1.addWall(new Wall(this, 1930, 880,350,55));
    map1.addWall(new Wall(this, 0, 1765,2400,35));
    map1.addWall(new Wall(this, 560, 223,300,100));
    map1.addWall(new Wall(this, 920, 223,300,100));
    map1.addWall(new Wall(this, 420, 440,320,120));
    map1.addWall(new Wall(this, 790, 440,300,90));
    map1.addWall(new Wall(this, 2020, 1650,250,35));
    map1.addWall(new Wall(this, 1410, 1650,395,35));
    map1.addWall(new Wall(this, 1185, 1650,145,35));
    map1.addWall(new Wall(this, 1185, 580,40,1105));
    map1.addWall(new Wall(this, 1185, 1350,125,50));
    map1.addWall(new Wall(this, 1430, 1350,225,50));
    map1.addWall(new Wall(this, 1185, 580,288,40));
    map1.addWall(new Wall(this, 610, 880,700,60));
    map1.addWall(new Wall(this, 1070, 1000,50,675));
    map1.addWall(new Wall(this, 970, 1000,150,53));
    map1.addWall(new Wall(this, 630, 1000,260,53));
    map1.addWall(new Wall(this, 630, 1000,80,540));
    map1.addWall(new Wall(this, 830, 1558,290,60));
    map1.addWall(new Wall(this, 1800, 258,460,40));
    map1.addWall(new Wall(this, 2260, 190,40,140));
    map1.addWall(new Wall(this, 2240, 620,55,318));
    map1.addWall(new Wall(this, 150, 150,45,558));
    map1.addWall(new Wall(this, 145, 820,45,100));
     map1.addWall(new Wall(this, 145, 880,300,45));
    map1.addWall(new Wall(this, 1450, 1480,50, 205));

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

    hospital.dialogue = [];
    hospital.dialogue.push(new Dialogue(this, "Tristan", "Now what?", "./images/tristan.png", 4));
    hospital.dialogue.push(new Dialogue(this, "Gabrielle", "My friend has been taken by one of the Breaker's henchmen.", "./images/Gabrielle.png", 4, true));
    hospital.dialogue.push(new Dialogue(this, "Gabrielle", "He's trapped within a pocket dimension.", "./images/Gabrielle.png", 4, true));
    hospital.dialogue.push(new Dialogue(this, "Gabrielle", "I will cast us a new portal. It will take me some time to gather energy.", "./images/Gabrielle.png", 4, true));
    hospital.dialogue.push(new Dialogue(this, "Tristan", "What do I do until then?", "./images/tristan.png", 4));
    hospital.dialogue.push(new Dialogue(this, "Gabrielle", "Survive...", "./images/Gabrielle.png", 4, true));
    hospital.dialogue.push(new Dialogue(this, "Tristan", "Thought that was a given.", "./images/tristan.png", 4));

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
    ruins.setItems(ruinItems);

    var bossMap = new Map(this, ASSET_MANAGER.getAsset("./images/bossMap1.png"), "Boss Map - Level 1", 800, 600, 800, 600, 0.5);
    var boss = new Boss(this);
    // boss.health = 5;
    bossMap.addVillain(boss);
    bossMap.isBossMap = true;
    // map1.update = function() {
        // console.log("windowX" + this.game.getWindowX);
        // console.log("windowy" + this.game.getWindowy);
    // }

    bossMap.update = function() {
        if (this.unlocked === undefined) {
            this.unlocked = false;
            this.game.lastVillain = null;
        }
        if (this.initalKills === undefined) {
            this.initalKills = this.game.kills;
            this.currentKill = null;
        }
        if (this.game.lastVillain && (this.game.kills - this.initalKills) % 4 === 0 && this.currentKill !== this.game.lastVillain) {
            this.currentKill = this.game.lastVillain;
            this.game.addEntity(this.game.generateRandomItem(this.game.lastVillainKilledX, this.game.lastVillainKilledY));
        }

        //check if you defeated the boss
        if (this.game.lastVillain && this.game.lastVillain.name === "FinalBoss"
            && !this.unlocked) {
            this.unlocked = true;
            for(var i = 0; i < this.game.villains.length; i++) {
                this.game.villains[i].removeFromWorld = true;
            }
            this.game.addEntity(new TimeWarper(this.game));

            this.dialogue.push(new Dialogue(this, "Tristan", "Woah! Are you me?", "./images/tristan.png", 4));
            this.dialogue.push(new Dialogue(this, "Gabrielle", "Tristan meet Alternate World Tristan.", "./images/Gabrielle.png", 4, true));
            this.dialogue.push(new Dialogue(this, "Tristan", "Like looking in a mirror.", "./images/tristan.png", 4));
            this.dialogue.push(new Dialogue(this, "Tristan", "A good looking mirror...", "./images/tristan.png", 4));
            this.dialogue.push(new Dialogue(this, "Alternate Tristan", "I like this guy, Gabrielle.", "./images/alternate-tristan.png", 4, true));
            this.dialogue.push(new Dialogue(this, "Tristan", "What's going on?", "./images/tristan.png", 4));
            this.dialogue.push(new Dialogue(this, "Gabrielle", "You were chosen, Tristan.", "./images/Gabrielle.png", 4, true));
            this.dialogue.push(new Dialogue(this, "Gabrielle", "Your soul is a fractured spirit.", "./images/Gabrielle.png", 4, true));
            this.dialogue.push(new Dialogue(this, "Gabrielle", "One existing in multiple dimensions.", "./images/Gabrielle.png", 4, true));
            this.dialogue.push(new Dialogue(this, "Gabrielle", "This Alternate Tristan is a Time Warper, capable of bending time to his will.", "./images/Gabrielle.png", 4, true));
            this.dialogue.push(new Dialogue(this, "Gabrielle", "He will assist us in fighting the Breaker.", "./images/Gabrielle.png", 4, true));
            this.dialogue.push(new Dialogue(this, "Gabrielle", "Come on. We must head back to where we came.", "./images/Gabrielle.png", 4, true));

            this.dialogue.push(new Dialogue(this, "NEW PARTY MEMBER", "Alternate Tristan has been added to your party. Swap to him by pressing 3.", null, 4, "gameMessage"));
            this.dialogue.push(new Dialogue(this, "NEW PARTY MEMBER", "Alternate Tristan can slow down and freeze time.", null, 4, "gameMessage"));


            this.drawDialogue = true;
            var hospital2 = this.game.allMaps["hospital"];
            var ruins2 =  this.game.allMaps["ruins"];
            hospital2.dialogue = [];
            hospital2.drawDialogue = false;
            hospital2.update = function() {

                if (this.unlocked === undefined) {
                    this.unlocked = false;
                    this.unlocked2 = false;
                }

                if(!this.unlocked2){
                    for(var i = 0; i < this.game.villains.length; i++) {
                        this.game.villains[i].removeFromWorld = true;
                    }

                    this.unlocked2 = true;
                    for (var i = 0; i < 50; i++) {
                        this.game.addEntity(new Villain(this.game));
                    }

                    var ruins2 = this.game.allMaps["ruins"];
                    ruins2.dialogue = [];
                    ruins2.drawDialogue = false;
                    ruins2.update = function() {

                        if(this.unlocked === undefined) {
                            this.unlocked = false;
                        }

                        if(!this.unlocked) {

                            for (var i = 0; i < 100; i++) {
                                this.game.addEntity(new Villain(this.game, undefined, undefined, this.spawnPoints));
                            }

                            this.unlocked = true;
                            this.game.addEntity(new Portal(this.game, 100, 100, this.game.allMaps["mill"], 200, 200));
                        }
                    }
                    this.game.addEntity(new Portal(this.game, 200, 200, ruins2, 1700, 1400));
                }
            }
            this.game.addEntity(new Portal(this.game, 400, 400, hospital2, 94, 1186));
        }
    }

    hospital.update = function() {
        if (this.startingKills === undefined) {
            this.startingKills = this.game.kills;
            this.mapTime = 0;
            this.activateDialogue = true;
        }
        if (this.mapTime > 1.5 && this.activateDialogue === true) {
            this.drawDialogue = true;
            this.activateDialogue = false;
            this.mapTime += this.game.timer.tick() * 10;
        } else {
            this.mapTime += this.game.timer.tick() * 10;
        }

        if (this.game.kills - this.startingKills > 20 && !this.unlocked) {
                hospital.dialogue.push(new Dialogue(this, "Gabrielle", "I'm casting the portal. It is time, mortal.", "./images/Gabrielle.png", 4, true));
                hospital.dialogue.push(new Dialogue(this, "Tristan", "You know... you are one pushy lady.", "./images/tristan.png", 4));

                hospital.drawDialogue = true;
                this.unlocked = true;
                this.game.addEntity(new Portal(this.game, 94, 1186, bossMap, 700, 200));
        }
    }

    var portal = new Portal(this, 1700, 1400, hospital, 200, 200);
    ruins.update = function() {

        if (this.randomKillNumber === undefined) {
            this.randomKillNumber = 10 + randomInt(10);
            this.keyNeedsAdding = true;
        }
        if (this.game.kills === this.randomKillNumber && this.keyNeedsAdding && this.game.lastVillainKilledX) {

            for (var i = 0; i < 20; i++) {
                this.game.addEntity(new Villain(this.game, undefined, undefined, this.spawnPoints));
            }

            var key = new Key(this.game, this.game.lastVillainKilledX, this.game.lastVillainKilledY, portal, 4);

            key.update = function () {
                var player = this.game.getPlayer();
                if (player && this.collect(player)) {
                    this.game.map.dialogue = [];
                    this.removeFromWorld = true;
                    this.game.addEntity(this.portal);
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "Thank you. My soul is in debt to you.", "./images/Gabrielle.png", 4, true));
                    this.game.map.dialogue.push(new Dialogue(this, "Tristan", "Holy crap... I think I just died and gone to heaven...", "./images/tristan.png", 4));
                    this.game.map.dialogue.push(new Dialogue(this, "Tristan", "Sexy heaven.", "./images/tristan.png", 4));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "Ugh... mortal men are pigs.", "./images/Gabrielle.png", 4, true));

                    this.game.map.dialogue.push(new Dialogue(this, "Tristan", "So you are an angel?", "./images/tristan.png", 4));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "Of sorts. My name is Gabrielle, the Archangel of Hope.", "./images/Gabrielle.png", 4, true));

                    this.game.map.dialogue.push(new Dialogue(this, "Tristan", "And what... I’m dead?", "./images/tristan.png", 4));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "No... but we are partially in Death.", "./images/Gabrielle.png", 4, true));

                    this.game.map.dialogue.push(new Dialogue(this, "Tristan", "Come again.", "./images/tristan.png", 4));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "The dimensions have shattered. A rift has been made.", "./images/Gabrielle.png", 4, true));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "By the Breaker, Destroyer of Realms.", "./images/Gabrielle.png", 4, true));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "Heaven, Hell, Death, and the Seven Alternate Worlds have collided.", "./images/Gabrielle.png", 4, true));
                    this.game.map.dialogue.push(new Dialogue(this, "Tristan", "Okay... so what happened everyone? Namely... my son.", "./images/tristan.png", 4));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "Their souls have been trapped.", "./images/Gabrielle.png", 4, true));
                    this.game.map.dialogue.push(new Dialogue(this, "Tristan", "What? So why haven't I been trapped?", "./images/tristan.png", 4));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "Help me, and I’ll show you.", "./images/Gabrielle.png", 4, true));
                    this.game.map.dialogue.push(new Dialogue(this, "Tristan", "Alright, Angelface, I'm going to trust you for now", "./images/tristan.png", 4));
                    this.game.map.dialogue.push(new Dialogue(this, "Gabrielle", "There is a portal. We must get to it.", "./images/Gabrielle.png", 4, true));
                    this.game.map.dialogue.push(new Dialogue(this, "NEW PARTY MEMBER ADDED", "Swap between party members by pressing 1 or 2.", null, 4, "gameMessage"));
                    this.game.map.dialogue.push(new Dialogue(this, "NEW PARTY MEMBER ADDED", "Angel has attack and health halo's that help her to hurt and heal.", null, 4, "gameMessage"));

                    this.game.addEntity(new Angel(this.game));
                    this.game.map.drawDialogue = true;
                }
            }

            this.game.addEntity(key);

            this.keyNeedsAdding = false;
        }
    }


    ruins.dialogue.push(new Dialogue(this, "Tristan", "What the hell happened here?", "./images/tristan.png", 4));
    ruins.dialogue.push(new Dialogue(this, "Voice", "Help me... Please, someone help ...", "./images/woman-shadow.png", 4, true));
    ruins.dialogue.push(new Dialogue(this, "Tristan", "What the— Am I hearing voices now? You’re going crazy, Trist.", "./images/tristan.png", 4));
    ruins.dialogue.push(new Dialogue(this, "Voice", "Is someone out there?", "./images/woman-shadow.png", 4, true));
    ruins.dialogue.push(new Dialogue(this, "Tristan", "Yeah, someone’s out here. And someone’s crazy pissed.", "./images/tristan.png", 4));
    ruins.dialogue.push(new Dialogue(this, "Voice", "You’re not crazy. I’m communicating to you telepathically.", "./images/woman-shadow.png", 4, true));
    ruins.dialogue.push(new Dialogue(this, "Tristan", "Who the hell are you? What's going on? What do you want from me?", "./images/tristan.png", 4));
    ruins.dialogue.push(new Dialogue(this, "Voice", "I will answer your questions if you save me.", "./images/woman-shadow.png", 4, true));
    ruins.dialogue.push(new Dialogue(this, "Tristan", "And how do I save you?", "./images/tristan.png", 4));
    ruins.dialogue.push(new Dialogue(this, "Voice", "An enemy has trapped me within an orb. Find the orb and set me free.",  "./images/woman-shadow.png", 4, true));
    ruins.dialogue.push(new Dialogue(this, "Tristan", "I guess I got nothing left to lose.", "./images/tristan.png", 4));

    ruins.dialogue.push(new Dialogue(this, "SPECIAL ABILITIES", "Speed up by pressing shift.", null, 4, "gameMessage"));
    ruins.dialogue.push(new Dialogue(this, "SPECIAL ABILITIES", "Drop landmines by pressing spacebar.", null, 4, "gameMessage"));

    // this.setMap(bossMap);
    
    ruins.setItems(ruinItems);
    ruins.drawDialogue = false;
    // this.setMap(map1);
    //map3.setItems(ruinItems);
    //ruins.drawDialogue = true;
    hospital.drawDialogue = false;
    // this.setMap(hospital);
    // this.setMap(ruins);
    var mill = new Map(this, ASSET_MANAGER.getAsset("./images/mill.png"), "Small Room", 2560, 1730, 550, 550*.75, .69);

    mill.addWall(new Wall(this, 343, 56, 190, 17));
    mill.addWall(new Wall(this, 675, 56, 275, 17));
    mill.addWall(new Wall(this, 470, 398, 713, 17));
    mill.addWall(new Wall(this, 470, 398, 17, 460));
    mill.addWall(new Wall(this, 470 + 713 - 23, 250, 23, 165));
    mill.addWall(new Wall(this, 470 + 713 - 23, 250, 80, 17));
    mill.addWall(new Wall(this, 470 + 872 - 23, 250, 100, 17));

    mill.addWall(new Wall(this, 470 + 713 - 23 + 255, 250, 17, 325));
    mill.addWall(new Wall(this, 470 + 500, 250 + 325 - 17, 463, 18));
    mill.addWall(new Wall(this, 470 + 500 + 3, 250 + 325 - 50, 17, 50));

    mill.addWall(new Wall(this, 470 + 500 + 3, 400, 17, 50));
    mill.addWall(new Wall(this, 1054, 250 + 325 - 63, 120, 30));
    mill.addWall(new Wall(this, 1320, 377, 43, 90));

    mill.addWall(new Wall(this, 470, 842, 93, 17));
    mill.addWall(new Wall(this, 640, 842, 238, 17));

    mill.addWall(new Wall(this, 972, 560, 17, 20));
    mill.addWall(new Wall(this, 964, 575, 17, 20));
    mill.addWall(new Wall(this, 956, 590, 17, 20));
    mill.addWall(new Wall(this, 948, 605, 17, 20));
    mill.addWall(new Wall(this, 940, 620, 17, 20));
    mill.addWall(new Wall(this, 932, 635, 17, 20));

    mill.addWall(new Wall(this, 900, 740, 17, 20));
    mill.addWall(new Wall(this, 895, 755, 17, 20));
    mill.addWall(new Wall(this, 887, 770, 17, 20));
    mill.addWall(new Wall(this, 879, 785, 17, 20));
    mill.addWall(new Wall(this, 871, 800, 17, 20));
    mill.addWall(new Wall(this, 864, 815, 17, 20));

    mill.addWall(new Wall(this, 70, 730, 155, 140));
    mill.addWall(new Wall(this, 70, 600, 17, 940));

    mill.addWall(new Wall(this, 1320, 56, 1200, 17));
    mill.addWall(new Wall(this, 1320 + 1155, -20, 200, 145));
    mill.addWall(new Wall(this, 2550, 0, 17, 1800));
    // mill.addWall(new Wall(this, 2490, 1073, 200, 240));

    mill.addWall(new Wall(this, 2300, 1400, 300, 150));
    mill.addWall(new Wall(this, 1785, 1140, 200, 200));

    mill.dialogue.push(new Dialogue(this, "Gabrielle", "We must find the four orbs of power in this dimension.", "./images/Gabrielle.png", 4, true));
    mill.dialogue.push(new Dialogue(this, "Gabrielle", "With that, I can open the gates to the Breaker’s henchmen’s realm.", "./images/Gabrielle.png", 4, true));
    mill.dialogue.push(new Dialogue(this, "Gabrielle", "There I can forge a portal into the Breaker’s realm.", "./images/Gabrielle.png", 4, true));
    mill.dialogue.push(new Dialogue(this, "Gabrielle", "And free your son and all of the other imprisoned souls.", "./images/Gabrielle.png", 4, true));

    mill.drawDialogue = true;

    mill.update = function() {
        if (this.numberOfKeys === undefined) {
            this.numberOfKeys = 0;
        }
        if (this.randomKillNumber === undefined) {
            this.randomKillNumber = this.game.kills + randomInt(10);
            this.keyNeedsAdding = 0;
        }
        console.log(this.randomKillNumber);
        if (this.game.kills === this.randomKillNumber && this.keyNeedsAdding === this.numberOfKeys && this.game.lastVillainKilledX && this.randomKillNumber <= this.game.kills && this.numberOfKeys < 4) {
            this.game.map.keyNeedsAdding += 1;

            key = new Key(this.game, this.game.lastVillainKilledX, this.game.lastVillainKilledY, new Portal(this.game.getPlayer().x + 10, this.game.getPlayer().y + 10, this.game.allMaps["map1"], 100, 100), 4);

            key.update = function () {
                if (!this.unlocked) {
                    this.game.map.numberOfKeys += 1;
                    this.unlocked = true;
                }
                var player = this.game.getPlayer();
                if (player && this.collect(player)) {
                    this.removeFromWorld = true;
                }
            }
            this.game.addEntity(key);
            this.randomKillNumber += randomInt(10);
        } else if (this.game.kills === this.randomKillNumber && this.keyNeedsAdding && this.game.lastVillainKilledX && this.randomKillNumber <= this.game.kills && this.numberOfKeys >= 4) {

            var key = new Key(this.game, this.game.lastVillainKilledX, this.game.lastVillainKilledY, new Portal(this.game, this.game.lastVillainKilledX + 20, this.game.lastVillainKilledY + 20, this.game.allMaps["map1"], 100, 100), 4);
            this.game.addEntity(key);
            this.keyNeedsAdding = false;
        }
    }
    // mill.addWall(new Wall(this, 2087, 235, 5, 240));
    // mill.addWall(new Wall(this, 2110, 400, 5, 50));


    // mill.addWall(new Wall(this, 2071, 235, 17, 45));
    // mill.addWall(new Wall(this, 2076, 275, 17, 45));
    // mill.addWall(new Wall(this, 2081, 315, 17, 45));
    // mill.addWall(new Wall(this, 2091, 355, 17, 45));
    // mill.addWall(new Wall(this, 2096, 395, 17, 45));
    // mill.addWall(new Wall(this, 2101, 435, 17, 45));


    // mill.addWall(new Wall(this, 2446, 180, 17, 45));
    // mill.addWall(new Wall(this, 2451, 220, 17, 45));
    // mill.addWall(new Wall(this, 2456, 260, 17, 45));
    // mill.addWall(new Wall(this, 2461, 300, 17, 45));
    // mill.addWall(new Wall(this, 2466, 340, 17, 45));
    // mill.addWall(new Wall(this, 2471, 380, 17, 45));

    // mill.addWall(new Wall(this, 2177, 210, 50, 17));
    // mill.addWall(new Wall(this, 2217, 205, 50, 17));
    // mill.addWall(new Wall(this, 2257, 200, 50, 17));
    // mill.addWall(new Wall(this, 2297, 195, 50, 17));
    // mill.addWall(new Wall(this, 2347, 190, 50, 17));
    // mill.addWall(new Wall(this, 2387, 185, 80, 17));

    mill.addWall(new Wall(this, 2071, 235, 17, 90));
    mill.addWall(new Wall(this, 2081, 305, 17, 90));
    mill.addWall(new Wall(this, 2091, 375, 17, 90));

    mill.addWall(new Wall(this, 2446, 180, 17, 90));
    mill.addWall(new Wall(this, 2460, 250, 17, 90));
    mill.addWall(new Wall(this, 2465, 320, 17, 90));
    // mill.addWall(new Wall(this, 2461, 300, 17, 45));
    // mill.addWall(new Wall(this, 2466, 340, 17, 45));
    // mill.addWall(new Wall(this, 2471, 380, 17, 45));

    mill.addWall(new Wall(this, 2177, 200, 100, 17));
    mill.addWall(new Wall(this, 2257, 190, 100, 17));
    mill.addWall(new Wall(this, 2297, 180, 155, 17));

    mill.addWall(new Wall(this, 2100, 460, 100, 17));
    mill.addWall(new Wall(this, 2285, 430, 200, 17));
    mill.addWall(new Wall(this, 2385, 405, 100, 17));

    mill.addWall(new Wall(this, 2265, 200, 10, 105));
    mill.addWall(new Wall(this, 2285, 385, 10, 60));

    
    mill.spawnPoints = [{x:200, y:200},
                        {x:1200, y: 528},
                        {x:2000, y:125},
                        {x:1738, y: 1038},
                        {x:1320, y: 1315},
                        {x:2220, y: 1480},
                        {x:524, y: 1305},
                        {x:472, y: 1144}];

    map1.spawnPoints = [{x:200, y:200},
                        {x:1200, y: 528},
                        {x:2000, y:125},
                        {x:1738, y: 1038},
                        {x:1320, y: 1315},
                        {x:2220, y: 1480},
                        {x:524, y: 1305},
                        {x:472, y: 1144}];
    
    map1.bossMap = true;
    var boss1 = new Boss(this);
    boss1.health = 10000;
    boss1.healthMAX = 10000;
    boss1.x = 515;
    boss1.y = 305;
    var boss2 = new Boss(this);
    boss2.health = 10000;
    boss2.healthMAX = 10000;
    boss2.x = 2130;
    boss2.y = 630;
    var boss3 = new Boss(this);
    boss3.health = 10000;
    boss3.healthMAX = 10000;
    boss3.x = 1548;
    boss3.y = 1320;
    boss2.update = boss2.summonSpiders;
    boss3.update = boss3.summonSkeletons;
    map1.addVillain(boss1);
    map1.addVillain(boss2);
    map1.addVillain(boss3);
    map1.dialogue.push(new Dialogue(this, "Gabrielle", "Once we destroy, the three henchmen. The final portal will open.", "./images/Gabrielle.png", 4, true));
    map1.drawDialogue = true;

    map1.update = function(){
        if (this.bossCount === undefined) {
            this.bossCount = 0;
        }
        if (this.game.lastVillain && this.game.lastVillain.name === "FinalBoss") {
            this.bossCount += 1;
            this.game.lastVillain = undefined;
        }
        if (this.bossCount >= 3 && !this.addFinalMap) {
            this.dialogue.push(new Dialogue(this, "Gabrielle", "Prepare to fight the Breaker.", "./images/Gabrielle.png", 4, true));
            this.drawDialogue = true;

            this.addFinalMap = true;
            var finalMap = new Map(this.game, ASSET_MANAGER.getAsset("./images/bossMap1.png"), "Boss Map - Level 1", 800, 600, 800, 600, 0.5);
            var breaker = new Boss(this.game);
            breaker.ability3Attributes = {
                // cooldowns used to determine whether to unleash ability3 or not
                maxCooldown: 10,
                cooldown: 10,
                activate: false
            };
            breaker.name = "BREAKER";
            breaker.update = function() {
                this.aiUpdate("zombie");
                if (this.frozen) {
                    return;
                }

                if (this.timerForSlowDown) {
                    if (this.timerForSlowDown <= 0) {
                        this.timerForSlowDown = 0;
                        for (var i = 0; i < this.game.entities.length; i++) {
                            var other = this.game.entities[i];
                            if (!other.isNonLiving && other.team != this.team && other.oldSpeed) {
                                other.maxSpeed = other.oldSpeed;
                                other.cooldown = other.oldCooldown;
                                if (other.movingAnimation) {
                                    other.movingAnimation.frameDuration = other.movingAnimationOld;
                                }
                                if (other.attackAnimation) {
                                    other.attackAnimation.frameDuration = other.attackAnimationOld;                        
                                }
                                other.oldSpeed = false;
                            }
                        }
                    } else {
                        for (var i = 0; i < this.game.entities.length; i++) {
                            var other = this.game.entities[i];
                            if (!other.isNonLiving && other.team != this.team && !other.oldSpeed) {
                                other.oldSpeed = other.maxSpeed;
                                other.maxSpeed /= 4;
                                other.oldCooldown = other.cooldown;
                                other.cooldown *= 4;
                                if (other.movingAnimation) {
                                    other.movingAnimationOld = other.movingAnimation.frameDuration;
                                    other.movingAnimation.frameDuration *= 4;
                                }
                                if (other.attackAnimation) {
                                    other.attackAnimationOld = other.attackAnimation.frameDuration;
                                    other.attackAnimation.frameDuration *= 4;
                                }
                            }
                        }
                        this.timerForSlowDown -= this.game.clockTick;
                    }
                }
                if (this.ability2Timer) {
                    if (this.ability2Timer >= 0) {
                        this.ability2Timer -= this.game.clockTick;
                        if (this.ability2Check > this.ability2Timer) {
                            this.ability2Check -= 1;
                            var villain = new Villain(this.game, this.x + this.velocity.x, this.y + this.velocity.y);
                            this.game.addEntity(villain);
                        }
                        this.velocity.x = 0;
                        this.velocity.y = 0;
                    } else {
                        this.ability2Timer = false;
                    }
                }

                if (this.ability1Timer) {
                    if (this.ability1Timer <= 0) {
                        this.ability1Timer = false;
                        this.maxSpeed = this.originalMaxSpeed;
                        this.movingAnimation.frameDuration = this.movingAnimation.originalFrameDuration;
                    } else {
                        this.ability1Timer -= this.game.clockTick;
                    }
                }

            }
            breaker.healthMAX = 50000;
            breaker.health = 50000;


            finalMap.addVillain(breaker);
            this.game.addEntity(new Portal(this.game, this.game.getPlayer().x + 60, this.game.getPlayer().y + 60, finalMap, 100, 100));
        }
    }
    ruins.setItems(ruinItems);
    ruins.drawDialogue = true;
    ruins.stopSpiders = true;
    ruins.stopSkeletons = true;
    hospital.stopSkeletons = true;

    // this.setItems(hospitalItems);

    // this.addEntity(new Portal(this, 800, 600, hospital, 200, 200));

    
    // var angelPlayer = new Angel(this);
    // angelPlayer.x = 600;
    // angelPlayer.canvasX = 32;
    // this.addEntity(angelPlayer);

    // var warperPlayer = new TimeWarper(this);
    // warperPlayer.x = 500;
    // warperPlayer.canvasX = 500;
    // this.addEntity(warperPlayer);

    // After Boss maps
    
    //save all the maps to the all Maps Array
    this.allMaps["ruins"] = ruins;
    this.allMaps["hospital"] = hospital;
    this.allMaps["map1"] = map1;
    this.allMaps["mill"] = mill;
    // var player2 = new playerControlled(this);
    // this.addEntity(player2);

    // var bossMap = new Map(this, ASSET_MANAGER.getAsset("./images/bossMap1.png"), "Boss Map - Level 1", 800, 800, 800, 800, 0.5);
    // bossMap.addVillain(new Boss(this));
    // bossMap.isBossMap = true;

    // this.addEntity(new Portal(this, 94, 1186, bossMap, 700, 200));
    // this.setMap(bossMap);
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
    if (entity.type === "playerControlled") this.players.push(entity);
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

GameEngine.prototype.drawDialogue = function(dialogue) {
    var margin = 15;
    var imageWidth = 75;
    var imageHeight = 75;

    var height = 75;

    var lineSpacing = 30;
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "black";
    var color = "maroon";
    var roundRectX = imageWidth + (margin * 2);
    var dialogueMessageX = imageWidth + (margin * 3);
    var imageX = margin;
    var width;

    if (dialogue.rightSide === "gameMessage") {
        color = "gold";
        roundRectX = (margin);
        dialogueMessageX = margin * 2;
        imageX = this.surfaceWidth - imageWidth - margin;
        this.ctx.fillStyle = "black";
    } else if (dialogue.rightSide) {
        color = "green";
        roundRectX = (margin);
        dialogueMessageX = margin * 2;
        imageX = this.surfaceWidth - imageWidth - margin;
    }

    if (dialogue.rightSide != "gameMessage") {
        width = this.surfaceWidth - imageWidth - margin * 3;

        roundRect(this.ctx, roundRectX, this.surfaceHeight - height - margin, width, height, 10, true, true);
        
        this.ctx.font = "bolder 22px Arial";
        this.drawMessage(dialogue.name, dialogueMessageX, this.surfaceHeight - height + margin, color, "bolder 24px Arial");

        this.drawMessage(dialogue.dialogue, dialogueMessageX, this.surfaceHeight - height + margin + lineSpacing, "black", "18px Arial");

        this.ctx.drawImage(dialogue.img, 0, 0, imageWidth, imageHeight, imageX, this.surfaceHeight - margin - imageHeight, imageWidth, imageHeight);
    } else {
        width = this.surfaceWidth - margin * 2;

       roundRect(this.ctx, roundRectX, this.surfaceHeight - height - margin, width, height, 10, true, true);
        
        this.ctx.font = "bolder 22px Arial";
        this.drawMessage(dialogue.name, dialogueMessageX, this.surfaceHeight - height + margin, color, "bolder 24px Arial");

        this.drawMessage(dialogue.dialogue, dialogueMessageX, this.surfaceHeight - height + margin + lineSpacing, "white", "18px Arial");
    }
    // this.ctx.drawImage(dialogue.img, margin, this.surfaceHeight - margin, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
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

        var entity = this.entities[i];
        // then calls the draw method on the entities and passes the ctx so that they can be drawn
        if (entity.type !== "playerControlled" || entity.controlled) {
            entity.draw(this.ctx);
        }
    }

    this.drawScore();
    this.drawExperience();

    if (this.getPlayer()) {
        var heightOfAbilityImages = 50;
        var marginOfAbilityImages = 20;
        if ((this.getPlayer() && this.getPlayer().ability1Attributes.cooldown < 0 && this.getPlayer().name != "Angel")||
            (this.getPlayer().name === "Angel" && this.getPlayer().currentAbility == 1)) {
            this.ability1Picture = this.getPlayer().ability1PictureActive;
            this.abilityButton1 = {x:marginOfAbilityImages, y:this.surfaceHeight - marginOfAbilityImages - heightOfAbilityImages, height:heightOfAbilityImages, width:heightOfAbilityImages};
        } else {
            this.ability1Picture = this.getPlayer().ability1PictureInactive;
        }

        if ((this.getPlayer() && this.getPlayer().ability2Attributes.cooldown < 0 && this.getPlayer().name != "Angel") || (this.getPlayer().name === "Angel" && this.getPlayer().currentAbility == 2)) {
            this.ability2Picture = this.getPlayer().ability2PictureActive;
            this.abilityButton2 = {x:marginOfAbilityImages + heightOfAbilityImages + marginOfAbilityImages, y:this.surfaceHeight - marginOfAbilityImages - heightOfAbilityImages, height:heightOfAbilityImages, width:heightOfAbilityImages};
        } else {
            this.ability2Picture = this.getPlayer().ability2PictureInactive;
        }

        this.ctx.drawImage(this.ability1Picture, 0, 0, heightOfAbilityImages, heightOfAbilityImages, marginOfAbilityImages, this.surfaceHeight - marginOfAbilityImages - heightOfAbilityImages, heightOfAbilityImages, heightOfAbilityImages);

        this.ctx.drawImage(this.ability2Picture, 0, 0, heightOfAbilityImages, heightOfAbilityImages, marginOfAbilityImages * 2 + heightOfAbilityImages, this.surfaceHeight - marginOfAbilityImages - heightOfAbilityImages, heightOfAbilityImages, heightOfAbilityImages);
    }

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

    if (this.aura && this.halo > -10) {
        this.halo -= .19;
    } else {
        this.halo = this.maxHalo;
    }
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
                var zom;
                if (!this.map.spawnPoints) {
                    zom = new Villain(this);
                } else {
                    zom = new Villain(this, undefined, undefined, this.map.spawnPoints);
                }
                this.addEntity(zom);
            }
        }
    }
    if (!this.map.stopSpiders) {
       AddSpiders(this);
    }
    if (!this.map.stopSkeletons) {
       AddSkeletons(this);
    }

    // cyles through all of the entities once again
    for (var i = 0; i < entitiesCount; i++) {

        var entity = this.entities[i]; // the current entity

        // if the entity is not removed from world
        if (!entity.removeFromWorld && (entity.type !== "playerControlled" || entity.controlled)) {

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

    // cycles through all the villains entities backwards
    for (var i = this.villains.length - 1; i >= 0; --i) {
        if (this.powerUpKill === undefined) {
            this.powerUpKill = this.kills + randomInt(10) + 1;
        }
        if (this.villains[i].removeFromWorld) {
            var villain = this.villains[i];
            if (villain.name == "BREAKER") {
                this.menuMode = "Win";
            }
            this.lastVillain = villain;
            this.lastVillainKilledX = villain.x - villain.radius;
            this.lastVillainKilledY = villain.y - villain.radius;
            this.villains.splice(i, 1);

            console.log(this.powerUpKill);
            if (this.kills === this.powerUpKill) {
                this.powerUpKill = this.kills + randomInt(10) + 1;
                this.addEntity(this.generateRandomItem(this.lastVillainKilledX, this.lastVillainKilledY));
            }

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
                var currentPlayer = this.players[i];
                this.deadPlayers.push(currentPlayer);
                // // cycle through the other players
                for (var j = 0; j < this.players.length; j++) {
                    // for the first player that is not removedFromWorld
                    if (!this.players[j].removeFromWorld) {
                        // swap the controls of the player and break out of the loop
                        this.players[j].controlled = true;
                        this.players[j].x = currentPlayer.x;
                        this.players[j].canvasX = currentPlayer.canvasX;
                        this.players[j].y = currentPlayer.y;
                        this.players[j].canvasY = currentPlayer.canvasY;
                        this.players[j].inplay = true;
                        this.restoreSpeeds();
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
    
    if (this.abilityButton1 && this.click && this.checkMenuClick(this.abilityButton1)) {
        this.getPlayer().currentAbility = 1;
    }

    if (this.abilityButton2 && this.click && this.checkMenuClick(this.abilityButton2)) {
        this.getPlayer().currentAbility = 2;
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
    this.lastmap = map;
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

        for (var i = 0; i < this.players.length; i++) {
            var currentPlayerControlled = this.players[i];
            if (player !== currentPlayerControlled) {
                currentPlayerControlled.x = portal.enterX - i - 1;
                currentPlayerControlled.y = portal.enterY - i - 1;
                currentPlayerControlled.canvasX = portal.enterX - i - 1;
                currentPlayerControlled.canvasY = portal.enterY - i - 1;
            }
        }
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

    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i].type == "landmine") {
            this.entities[i].removeFromWorld = true;
        }
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
    var scene2 = 30;
    var scene3 = 40;
    var indent = 70;

    if (this.alpha5 < 1) {
            this.skipIntroButton = {x:this.surfaceWidth - 100, y: this.surfaceHeight - 75, height:50, width:75};    

        this.skipIntroButton.lines = ["Skip"];
        this.drawButton(this.skipIntroButton, "transparent");
    }

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
    this.endaudio.play();   
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
    this.winaudio.play();
        
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
    
    // this.ctx.fillText(line1,this.startButton.x + 32,this.startButton.y + 3); 
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
                if (this.musicPlaying) {
                    this.backgroundaudio.play();
                }                   
                document.getElementById('gameWorld').style.cursor = '';
                this.menuMode = "Game";
            } else if (this.checkMenuClick(this.startButton)){
                //console.log("should be restarting");
                this.restart();
                if (this.musicPlaying) {
                    this.backgroundaudio.play();
                }   
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
                if (this.musicPlaying) {
                    this.backgroundaudio.play();
                }   
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
        if (player.originalSpeed) {
            player.originalSpeed += 1;
        }
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

GameEngine.prototype.loopDialogue = function() {
    if (this.map.drawDialogue) {
        if (this.map.dialogueStartTime === undefined) {
            this.map.dialogueStartTime = 0;
            this.map.currentDialogueIndex = 0;
        }
        if (this.map.dialogueChange === undefined || this.map.dialogueChange === false) {
            if (this.gameRunning) {
                this.map.dialogueChange = .35;
            } else {
                this.map.dialogueChange = 2;
            }
        }
        this.drawDialogue(this.map.dialogue[this.map.currentDialogueIndex]);
        if (this.map.dialogueStartTime >= this.map.dialogueChange) {
            this.map.currentDialogueIndex += 1;
            this.map.dialogueStartTime = 0;
            if (this.map.dialogue[this.map.currentDialogueIndex] === undefined) {
                this.map.drawDialogue = false;
                this.gameRunning = true;
                return;
            }
            if (this.gameRunning) {
                this.map.dialogueChange = .35;
            } else {
                this.map.dialogueChange = 2;
            }
        } else {
            this.map.dialogueStartTime += this.timer.tick();
        }
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
        this.loopDialogue();

    } else {
        for (var i = 0; i < this.players.length; i++) {
            this.drawPlayerView(i, this.players[i]);
        }
    }

    this.click = null; // resets the click to null
    
    if (this.musicPlaying) {
        this.backgroundaudio.play();
    }
    this.map.update();

}