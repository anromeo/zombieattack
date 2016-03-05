function Speed(game, image, spawnPoints, x, y) {
    NonLivingEntity.prototype.setNonLiving.call(this, true);
    this.image = image;
    this.game = game;

    this.spawnPoints = spawnPoints;

    if (x !== undefined && y !== undefined) {
        this.x = x;
        this.y = y;
    } else if (spawnPoints.length < 1) {
        this.x = 200;
        this.y = 200;
    } else {
        var spawnpoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
        this.x = spawnpoint.x;
        this.y = spawnpoint.y;
    }

    this.width = 35;
    this.height = 35;

    this.canvasX = this.x;
    this.canvasY = this.y;

    this.radius = 40;
    this.name = "Speed";
    this.type = "item";

    // this.x = 200;
    // this.y = 600;
    // console.log(this.x);
    // console.log(this.y);

}

Speed.prototype = new NonLivingEntity();
Speed.prototype.constructor = Speed;

Speed.prototype.update = function () {
}

Speed.prototype.action = function (player) {
      if (!this.removeFromWorld) {
          player.upSpeed();
      }
      this.removeFromWorld = true;
}

Speed.prototype.draw = function (ctx) {
      NonLivingEntity.prototype.draw.call(this, ctx);
}
