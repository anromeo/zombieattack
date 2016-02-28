function Map(game, image, name, worldWidth, worldHeight, mapRatioWidth, mapRatioHeight, ratioX, ratioY) {

	  this.game = game;
	  this.image = image;
	  this.name = name;
    if (this.ratioY === undefined) {
        this.ratioX = ratioX;
        this.ratioY = ratioX;
    } else {
        this.ratioX = ratioX;
        this.ratioY = ratioY;
    }

	  this.walls = [];
    this.attracters = [];

    this.worldWidth = worldWidth; 
    this.worldHeight = worldHeight; 

    this.mapRatioWidth = mapRatioWidth;
    this.mapRatioHeight = mapRatioHeight;

    this.villains = [];
    this.weapons = [];
    this.isBossMap = false;
}

Map.prototype.addWall = function (wall) {
	 this.walls.push(wall);
}

Map.prototype.addAttracter = function (attracter) {
   this.attracters.push(attracter);
}

Map.prototype.addVillain = function(villain) {
    this.villains.push(villain);
}

Map.prototype.addWeapon = function(weapon) {
    this.weapons.push(weapon);
}