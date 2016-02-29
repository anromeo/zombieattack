/**
 * This is the attracter that is used to attract object to it.
 */
function Attracter(game, x, y, attracterRange) {

    NonLivingEntity.prototype.setNonLiving.call(this, true);

    // The X and Y Coordinates of the Attracters
    this.game = game;
    this.x = x;
    this.y = y;
    this.radius 

    this.radius = 100;
    if (attracterRange === undefined) {
        this.attracterRange = 50;
    } else {
        this.attracterRange = attracterRange;
    }
    this.name = "Attracter";
    this.type = "attracter";

}

Attracter.prototype = new NonLivingEntity();
Attracter.prototype.constructor = Attracter;


Attracter.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var other = this.game.entities[i];

        var acceleration = 1000;

        if (!other.isNonLiving && this.collide({
            x: other.x,
            y: other.y,
            radius: this.attracterRange
        })) {
            if (!other.isNonLiving && other.type !== "projectile" && (other.name !== "playerControlled" || other.controlled === false)) {
            // if (other.name === "playerControlled") {
                // distance between this entity and the other entity
                dist = distance(this, other);
                // calculation to draw this LivingEntity from the corner
                var difX = (other.x - this.x) / dist;
                var difY = (other.y - this.y) / dist;
                other.velocity.x -= difX * acceleration / (dist * dist);
                other.velocity.y -= difY * acceleration / (dist * dist);
                // console.log("X: " + other.velocity.x + " | Y: " + other.velocity.y);
            }  
        }
    }
}

Attracter.prototype.draw = function (ctx) {
    this.drawCircle(ctx, "green", this.x  - this.game.getWindowX(), this.y - this.game.getWindowY(), this.radius);
    this.drawCircle(ctx, "yellow", this.x  - this.game.getWindowX(), this.y - this.game.getWindowY(), this.attracterRange);

}