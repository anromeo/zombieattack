function Player(game) {
    this.player = 1;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.visualRadius = 500;
    this.name = "Player 1";
    this.color = "White";
    this.cooldown = 0;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};