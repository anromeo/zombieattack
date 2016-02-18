var friction = 1;
var maxSpeed = 100;
var minSpeed = 5;


function Entity(game, x, y) {
    this.game = game;
	this.radius = 10;
    this.x = x;
    this.y = y;
	this.canvasX = x;
	this.canvasY = y;
	this.nonLiving = false;
    if(this.game) {
        this.ctx = game.ctx;
    }
    this.removeFromWorld = false;
}

Entity.prototype.setNonLiving = function (bool) {
	this.nonLiving = bool;
}

Entity.prototype.setLocation = function (X, Y) {
    this.x = X;
    this.y = Y;
}

Entity.prototype.setRemoved = function (bool) {
    this.removeFromWorld = bool;
}

Entity.prototype.update = function () {
	//console.log("updating");
	if (!this.nonLiving) {
	if (this.name !== "playerControlled" && this.name !== "Zombie"){
		//console.log(this.name);
	}	
	this.canvasX = this.x - this.game.getWindowX();
	this.canvasY = this.y - this.game.getWindowY();
}
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

// @deprecated
// Entity.prototype.rotateAndCache = function (image, angle) {
//     var offscreenCanvas = document.createElement('canvas');
//     var size = Math.max(image.width, image.height);
//     offscreenCanvas.width = size;
//     offscreenCanvas.height = size;
//     var offscreenCtx = offscreenCanvas.getContext('2d');
//     offscreenCtx.save();
//     offscreenCtx.translate(size / 2, size / 2);
//     offscreenCtx.rotate(angle);
//     offscreenCtx.translate(0, 0);
//     offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
//     offscreenCtx.restore();
//     //offscreenCtx.strokeStyle = "red";
//     //offscreenCtx.strokeRect(0,0,size,size);
//     return offscreenCanvas;
// }

function LivingEntity(game, pointerX, pointerY, directionX, directionY, locationX, locationY) {
    Entity.call(this, game, locationX, locationY);
	this.angle = 0;
	this.game = game;
    this.locationX = locationX;
    this.locationY = locationY;
    this.pointerX = pointerX; //replaced by this.angle?
    this.pointerY = pointerY; //replaced by this.angle?
    this.directionX = directionX;
    this.directionY = directionY;
	this.SpriteWidth = 60;  //default:60
	this.SpriteHeight = 60;  //default:60
	this.CenterOffsetX = 0; // puts the center of the sprite in the center of the entity
	this.CenterOffsetY = 0;  //puts the center of the sprite in the center of the entity
	this.SpriteRotateOffsetX = 0; //describes the point of rotation on the sprite changed from 1/2 width
	this.SpriteRotateOffsetY = 0; //describes the point of rotation on the sprite changed from 1/2 height
	// this.CenterOffsetX = CenterOffsetX; // puts the center of the sprite in the center of the entity
	// this.CenterOffsetY = CenterOffsetY;  //puts the center of the sprite in the center of the entity
	// this.SpriteRotateOffsetX = SpriteRotateOffsetX; //describes the point of rotation on the sprite changed from 1/2 width
	// this.SpriteRotateOffsetY = SpriteRotateOffsetY; //describes the point of rotation on the sprite changed from 1/2 height
	this.showHealthBar = true;
	this.healthBarCoords = {BeginX: 5, BeginY : -5, Width : 50, Height : 7};
	this.healthMAX = 100;
	this.health = this.healthMAX;
	this.angle = 0;
    this.strength = 25;
    this.speed = 10;
    this.movingAnimation = null;
    this.attackAnimation = null;
    this.struckAnimation = null;
    this.deathAnimation = null;
    this.currentAnimation = null;
}

LivingEntity.prototype = new Entity();
LivingEntity.prototype.constructor = LivingEntity;

LivingEntity.prototype.getX = function () {
    return this.locationX;
} 

LivingEntity.prototype.getY = function () {
    return this.locationY;
} 

LivingEntity.prototype.setX = function (x) {
    this.locationX = x;
}

LivingEntity.prototype.setY = function (y) {
    this.locationY = y;
}
 
LivingEntity.prototype.setMovingAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.movingAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

LivingEntity.prototype.setAttackAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.attackAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

LivingEntity.prototype.setStruckAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.struckAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

LivingEntity.prototype.setDeathAnimation = function (spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow) {
    this.deathAnimation = new Animation(spriteSheet, frameWidth, frameHeight, frameDuration, frames, loop, reverse, numFramesInRow);
}

// LivingEntity.prototype.draw = function () {
//     this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
// }

LivingEntity.prototype.draw = function (ctx) {
	//console.log("angle LE draw: " + this.angle);
    if (this.movingAnimation && this.name === "playerControlled" && this.controlled === true) {

//        console.log("Location: " + this.x + " " + this.y);
//        console.log("Mouse: " + this.game.x + " " + this.game.y);

        var rad = Math.atan2(this.game.y - this.y, this.game.x - this.x);
        var deg = rad * (180 / Math.PI);
		
		//trying to get gun to point at mouse
		 var angleOffset = 0;
		 if (this.game.mouse) {
			var dist = distance(this.game.mouse, {x: this.canvasX, y: this.canvasY});
			angleOffset = Math.tan(this.radius / dist) * (180/Math.PI) - 5;	
			//console.log(angleOffset);
			
		}
		deg -= angleOffset;
		
		//this.movingAnimation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius, this.y - this.radius, deg);
        this.movingAnimation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius - this.CenterOffsetX - this.game.getWindowX(), 
		this.y - this.radius - this.CenterOffsetY - this.game.getWindowY(), deg,
		this.SpriteRotateOffsetX, this.SpriteRotateOffsetY);
		//console.log("this.SpriteRotateOffsetX" + this.SpriteRotateOffsetX);
		//console.log("this.CenterOffsetX" + this.CenterOffsetX);

    } else { // Zombies
	//this.movingAnimation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius, this.y - this.radius, this.angle);
        this.movingAnimation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius - this.game.getWindowX(), this.y - this.radius - this.game.getWindowY(), this.angle);
    }
	
	//show kills
	ctx.beginPath();
	ctx.fillStyle = "Red";
	ctx.font = "48px serif";
	//console.log(this.game.kills);
	var message = "Kills: " + this.game.kills;
	ctx.fillText(message, 10, 50);
	ctx.stroke(); 
	
	if (this.showHealthBar) {			
		//black background
		ctx.beginPath();
		ctx.fillStyle = "black";
		ctx.fillRect(this.healthBarCoords.BeginX + this.canvasX, this.healthBarCoords.BeginY + this.canvasY, this.healthBarCoords.Width, this.healthBarCoords.Height);
		ctx.stroke(); 
		
		//actual health bar
		var tempHealth = this.health;
		if (tempHealth > this.healthMAX) {
			tempHealth = this.healthMAX;
		} else if (tempHealth < 0) {
			tempHealth = 0;
		}
		var healthPercent = (tempHealth / this.healthMAX);
		var healthGreenAbove = .7;
		var healthYellowAbove = .4;
		ctx.beginPath();
		if (healthPercent > healthGreenAbove) {
			ctx.fillStyle = "green";
		}else if (healthPercent > healthYellowAbove) {
			ctx.fillStyle = "yellow";
		} else {
			ctx.fillStyle = "red";
		}
		var calculatex = this.healthBarCoords.BeginX + this.canvasX;
		var calculatey = this.healthBarCoords.BeginY + this.canvasY;
		var calculatewidth = this.healthBarCoords.Width * healthPercent;
		ctx.fillRect(calculatex, calculatey, calculatewidth, this.healthBarCoords.Height);
		ctx.stroke(); 
		
		//outline of health bar
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.rect(this.healthBarCoords.BeginX + this.canvasX ,this.healthBarCoords.BeginY + this.canvasY,this.healthBarCoords.Width,this.healthBarCoords.Height);
		ctx.stroke(); 
	}

    if (this.game.showOutlines) {
        ctx.beginPath();
		ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.arc(this.canvasX, this.canvasY , 5, 0, Math.PI * 2, false);
        //ctx.arc(this.x, this.y , 5, 0, Math.PI * 2, false);
        ctx.closePath();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.arc(this.canvasX + this.SpriteWidth/2 + 2, this.canvasY + this.SpriteHeight/2 + 2, 5, 0, Math.PI * 2, false);
        //ctx.arc(this.x + this.SpriteWidth/2 + 2, this.y + this.SpriteHeight/2 + 2, 5, 0, Math.PI * 2, false);
        ctx.closePath();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = "purple";
        ctx.lineWidth = 1;
        ctx.arc(this.canvasX + this.CenterOffsetX, this.canvasY + this.CenterOffsetY, 5, 0, Math.PI * 2, false);
        //ctx.arc(this.x + this.CenterOffsetX, this.y + this.CenterOffsetY, 5, 0, Math.PI * 2, false);
        ctx.closePath();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = "green";
        ctx.lineWidth = 1;
        ctx.arc(this.canvasX + this.SpriteWidth, this.canvasY + this.SpriteHeight, 5, 0, Math.PI * 2, false);
        //ctx.arc(this.x + this.SpriteWidth, this.y + this.SpriteHeight, 5, 0, Math.PI * 2, false);
        ctx.closePath();
		ctx.stroke();
		
		ctx.beginPath();
        ctx.strokeStyle = "pink";
        ctx.lineWidth = 1;
        ctx.arc(this.canvasX + this.radius, this.canvasY + this.radius, 5, 0, Math.PI * 2, false);
        //ctx.arc(this.x + this.radius, this.y + this.radius, 5, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
		
		ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.arc(this.canvasX, this.canvasY, this.radius, 0, Math.PI * 2, false);
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.stroke();
    }

}

LivingEntity.prototype.update = function () {
	Entity.update();
    // if (this.health === 0) {
    //     this.currentAnimation = this.deathAnimation;
    // } else if (/* Attack button is pressed */) {
    //     this.currentAnimation = this.attackAnimation;
    // } else {
    //     this.currentAnimation = this.movingAnimation;
    // }
}

function NonLivingEntity(game, locationX, locationY) {
    Entity.call(this, game, locationX, locationY);
    this.name = "NonLiving";
    this.image = null;
}

NonLivingEntity.prototype = new Entity();
NonLivingEntity.prototype.constructor = NonLivingEntity;

NonLivingEntity.prototype.setImage = function (image) {
    this.image = image;
    console.log("Image set");
}

NonLivingEntity.prototype.setLocation = function (X, Y) {
    Entity.prototype.setLocation.call(this, X, Y);
}

NonLivingEntity.prototype.setNonLiving = function (bool) {
	Entity.prototype.setNonLiving.call(this, true);
}

NonLivingEntity.prototype.draw = function (ctx) {
  //  this.game.ctx.drawImage(this.image, 0, 0);
  ctx.drawImage(this.image, 0, 0);
  //ctx.drawImage(this.image, this.x - this.radius - this.game.getWindowX(), this.y - this.radius - this.game.getWindowY());
}

NonLivingEntity.prototype.update = function () {
}