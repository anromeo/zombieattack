
// find and replace TimeWarper with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()
// Source Used: http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/

function TimeWarper(game) {
    //LivingEntity.call(this, game, 0, 0, 0, 0, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));  
    // LivingEntity.call(this, game, game.surfaceWidth/2 * Math.random(), game.surfaceHeight/2 * Math.random());

    this.spawnPoints = [];
    this.spawnPoints[0] = { x: 190, y: 213 };
    this.spawnPoints[1] = { x: 659, y: 136 };
    this.spawnPoints[2] = { x: 976, y: 303 };
    this.spawnPoints[3] = { x: 965, y: 706 };
    this.spawnPoints[4] = { x: 167, y: 154 };
    this.spawnPoints[5] = { x: 138, y: 222 };
    this.spawnPoints[6] = { x: 184, y:  283 };
    this.spawnPoints[13] = { x: 190, y: 80 };
    this.spawnPoints[7] = { x: 138, y: 688 };
    this.spawnPoints[8] = { x: 449, y: 672 };
    this.spawnPoints[9] = { x: 136, y: 888 };
    this.spawnPoints[11] = { x: 664, y: 416 };
    this.spawnPoints[12] = { x: 190, y: 80 };
    this.movingAnimationImage = ASSET_MANAGER.getAsset("./images/alternativee-shooter-walking2.png");

    var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];

    // LivingEntity.call(this, game, spawnpoint.x, spawnpoint.y);
    LivingEntity.call(this, game, 100, 100);

    this.player = 1;
    // this.SpriteWidth = 80;
    // this.SpriteHeight = 43;

    this.SpriteWidth = 110;
    this.SpriteHeight = 176 / 3;
    this.numberOfMovingAnimations = 8;
    this.numberOfMovingAnimationsInRow = 3;

    this.radius = 30;
    this.controlled = false;
    this.action;
    this.weapon = null;
    this.game = game;
    this.name = "Time Warper";
    this.type = "playerControlled";
    this.color = "Black";
    this.team = "blue";
    this.shootingLine = true;
    this.angleOffset = 0;
    this.radialOffset = 15;
    this.attackType = "range";

    this.cooldown = 0;
    this.randomLine = {x:0, y:0};
    this.linecooldown = .002;
    this.linecooldownstart = .002;
    this.cooldownStartControlled = .45;
    this.cooldownStartNotControlled = .75;
    this.angleOffset =  60;
    //this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]
    this.CenterOffsetX = 10; // puts the center of the sprite in the center of the entity
    this.CenterOffsetY = 10; // puts the center of the sprite in the center of the entity
    this.SpriteRotateOffsetX = 8; //describes the point of rotation on the sprite changed from 1/2 width
    this.SpriteRotateOffsetY = -7; //describes the point of rotation on the sprite changed from 1/2 height
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/shooter-walking2.png"), this.SpriteWidth, this.SpriteHeight, .09, 8, true, false, 3);
    this.velocity = { x: 0, y: 0 };

    this.ability1Attributes.activate = false;
    this.ability2Attributes.activate = false;


    this.ability1Attributes.on = true;
    this.ability2Attributes.on = true;

    this.ability1PictureInactive = ASSET_MANAGER.getAsset("./images/shooter-ability1-inactive.png");
    this.ability1PictureActive = ASSET_MANAGER.getAsset("./images/shooter-ability1.png");


    this.ability2PictureActive = ASSET_MANAGER.getAsset("./images/shooter-ability2.png");
    this.ability2PictureInactive = ASSET_MANAGER.getAsset("./images/shooter-ability2-inactive.png");

    this.ability2Attributes.cooldown = 1;
    this.ability2Attributes.maxCooldown = 1;

    // this.ability3PictureInactive = ;
    // this.ability3PictureActive = ;

  //  this.maxSpeed = 200;

    this.speed = 30;
    this.vitality = 25;
    this.strength = 25;

    this.maxSpeed = this.speed * 4;
    this.healthMAX = this.vitality * 4;

    this.timerForSpeed = 0;
    this.originalSpeed = 100;

    this.currentAbility = 1;
};

TimeWarper.prototype = new playerControlled();
TimeWarper.prototype.constructor = TimeWarper;

TimeWarper.prototype.ability1 = function(entity) {
    console.log("Slow Down Time");
    entity.timerForSlowDown = 10;
}

TimeWarper.prototype.ability2 = function(entity) {
    console.log("Freezing Time");
    entity.timerForFreeze = 5;
}

// TimeWarper.prototype.ability3 = function(entity) {
//     console.log("Dropping Bomb");
// }

TimeWarper.prototype.update = function () {
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

    if (this.timerForFreeze) {
        if (this.timerForFreeze <= 0) {
            this.timerForFreeze = 0;
            for (var i = 0; i < this.game.entities.length; i++) {
                var other = this.game.entities[i];
                if (!other.isNonLiving && other.team != this.team && other.frozen) {
                    if (other.movingAnimation) {
                        other.movingAnimation.frozen = false;
                    }
                    if (other.attackAnimation) {
                        other.attackAnimation.frozen = false;                        
                    }
                    other.frozen = false;
                }
            }
        } else {
            for (var i = 0; i < this.game.entities.length; i++) {
                var other = this.game.entities[i];
                if (!other.isNonLiving && other.team != this.team && !other.frozen) {
                    other.frozen = true;
                    if (other.movingAnimation) {
                        other.movingAnimation.frozen = true;
                        other.movingAnimation.frozenFrame = other.movingAnimation.currentFrame();
                    }
                    if (other.attackAnimation) {
                        other.attackAnimation.frozen = true;
                        other.attackAnimation.frozenFrame = other.attackAnimation.currentFrame();
                    }
                }
            }
            this.timerForFreeze -= this.game.clockTick;
        }
    }
    playerControlled.prototype.update.call(this);

};