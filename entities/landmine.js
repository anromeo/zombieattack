function Landmine(game, x, y, team) {

    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.game = game;
    this.image = ASSET_MANAGER.getAsset("./images/land-mine.png");

    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.team = team;

    this.leftImageOffset = 5;
    this.topImageOffset = 0;
    this.radius = 25; // TODO remove this
    this.name = "Landmine";
    this.type = "landmine";

    this.trigger = false;

}

Landmine.prototype = new NonLivingEntity();
Landmine.prototype.constructor = Landmine;

Landmine.prototype.enter = function (other) {
    return (this.x <= other.x + other.radius) // in left side
            && (this.x + this.width >= other.x - other.radius) // in right side
            && (this.y <= other.y + other.radius) // in top
            && (this.y + this.height >= other.y - other.radius); // in bottom
}

Landmine.prototype.update = function () {
    if (!this.trigger) {
        for(var i = 0; i < this.game.entities.length; i++) {
            var entity = this.game.entities[i];
            if (entity.type !== "projectile" && this.team !== entity.team) {
                if (this.enter(entity)) {
                    this.trigger = true;
                    this.setAnimation(ASSET_MANAGER.getAsset("./images/land-mine-explosion.png"), 96, 96, .1, 7, false, false, 5);
					this.game.explosionaudio.play();
                    break;
                }
            }
        }

        if (this.trigger) {
            for(var i = 0; i < this.game.entities.length; i++) {
                var entity = this.game.entities[i];
                if (this.team !== entity.team) {
                    if (this.enter({x: entity.x, y: entity.y, radius: 100})) {
                        entity.health -= 100;
                    }
                }
            }
        }
    }

    if (this.animation && this.animation.isAnimationOver) {
        this.removeFromWorld = true;
    }
}

Landmine.prototype.draw = function (ctx) {
    if (this.animation) {
        this.animation.drawFrameRotate(this.game.clockTick, ctx, this.x - this.radius - this.game.getWindowX(), this.y - this.radius - this.game.getWindowY());
    } else {
        NonLivingEntity.prototype.draw.call(this, ctx);
    }
}