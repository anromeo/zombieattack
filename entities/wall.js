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
    for (i = 0; i < this.game.entities; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent !== "Wall") {
            if (this.collide(ent)) {
                console.log("collision");
                if((ent.x - ent.radius < this.x + this.width) && ((this.y + this.height < ent.y - ent.radius) || (this.y + this.height > ent.y + ent.radius))) {
                    ent.x += 1;
                }
            }
        }
    }
}

Wall.prototype.draw = function (ctx) {
    NonLivingEntity.prototype.draw.call(this, ctx);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(this.x - this.game.getWindowX(), this.y - this.game.getWindowY(), this.width, this.height);
    ctx.fill();

}

Wall.prototype.collide = function (other) {
        if (this.x < other.x + other.width &&
           this.x + this.width > other.x &&
           this.y < other.y + other.height &&
           this.height + this.y > other.y) {
            return true;
        }
            return false;
};
