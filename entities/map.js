function Map(game, image, name, worldWidth, worldHeight, mapRatioWidth, mapRatioHeight, ratio) {

	this.game = game;
	this.image = image;
	this.name = name;
	this.ratio = ratio;

	this.walls = [];

    this.worldWidth = worldWidth; 
    this.worldHeight = worldHeight; 

    this.mapRatioWidth = mapRatioWidth;
    this.mapRatioHeight = mapRatioHeight;

}

Map.prototype.addWall = function (wall) {
	this.walls.push(wall);
	//console.log("wall added")
}