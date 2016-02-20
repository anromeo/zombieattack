function Wall(game, topX, topY, width, height) {
    // NonLivingEntity.prototype.setImage.call(this, image);
    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.game = game;

    this.x = topX;
    this.y = topY;

    this.width = width;
    this.height = height;
    this.name = "Wall";
}

Wall.prototype = new NonLivingEntity();
Wall.prototype.constructor = Wall;

Wall.prototype.update = function () {
}

Wall.prototype.draw = function (ctx) {
    NonLivingEntity.prototype.draw.call(this, ctx);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(this.x - this.game.getWindowX(), this.y - this.game.getWindowY(), this.width, this.height);

    ctx.fill();
}
