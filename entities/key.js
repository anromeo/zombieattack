function Key(game, x, y, portal) {

    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.image = ASSET_MANAGER.getAsset("./images/key.png");
    this.game = game;
    this.portal = portal;
    // TODO USE THIS?? this.mapIndex

    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 41;


    this.leftImageOffset = 0;
    this.topImageOffset = 0;
    this.name = "Key";
    this.type = "key";

}

Key.prototype = new NonLivingEntity();
Key.prototype.constructor = Key;

Key.prototype.collect = function (other) {
    return (this.x <= other.x + other.radius) // in left side
            && (this.x + this.width >= other.x - other.radius) // in right side
            && (this.y <= other.y + other.radius) // in top
            && (this.y + this.height >= other.y - other.radius); // in bottom
}

Key.prototype.update = function () {
    var player = this.game.getPlayer();
    if (player && this.collect(player)) {
        this.removeFromWorld = true;
        this.game.addEntity(this.portal);
    }
}

Key.prototype.draw = function (ctx) {
    NonLivingEntity.prototype.draw.call(this, ctx);
}