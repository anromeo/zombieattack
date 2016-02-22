function Portal(game, x, y, map) {

    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.game = game;
    this.setAnimation(ASSET_MANAGER.getAsset("./images/portal.png"), 65, 66, .1, 4, true, false, 4);
    this.map = map;
    // TODO USE THIS?? this.mapIndex

    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;

    this.leftImageOffset = 10;
    this.topImageOffset = 10;
    this.radius = 30; // TODO remove this
    this.name = "Portal";
    this.type = "portal";

}

Portal.prototype = new NonLivingEntity();
Portal.prototype.constructor = Portal;

Portal.prototype.update = function () {
//    this.game.setMap(map);
}

Portal.prototype.draw = function (ctx) {
    NonLivingEntity.prototype.draw.call(this, ctx);
}