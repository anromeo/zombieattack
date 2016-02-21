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


// Wall.prototype.collide = function (other) {
//         if (this.x < other.x + other.width &&
//            this.x + this.width > other.x &&
//            this.y < other.y + other.height &&
//            this.height + this.y > other.y) {
//             return true;
//         }
//             return false;
// };
Wall.prototype.collideTop = function(other) { 
    return ((this.y < other.y + other.radius) // if the object is less than the top's y-coordinate (top of object)
        && (this.x < other.x + other.radius) // AND either if the right side of the object is greater than the the left side of this
        || (this.x + this.width > other.x - other.radius)); // OR if the left side of the object is greater than  right side of this
};
Wall.prototype.collideBottom = function(other) {
    if((this.y + this.height > other.y - other.radius) || (this.x < other.x + other.radius) || (this.x + this.width > other.x - other.radius));
};

Wall.prototype.collideLeft= function(other) {
    if((this.x < other.x + other.radius) || (this.y < other.y + other.radius) || (this.y + this.height > other.y - other.radius));
};

Wall.prototype.collideRight = function(other) {
    if((this.x + this.width > other.x - other.radius) || (this.y < other.y + other.radius) || (this.y + this.height > other.y - other.radius));
};

// if(this.collideLeft(other)){
//     other.x = this.x - other.radius;

// }
// if(this.collideRight(other)){
//     other.x = this.x + this.width + other.radius;

// }
// if(this.collideTop(other)){
//     other.y = this.y - other.radius;

// }
// if(this.collideBottom(other)){
//     other.y = this.y + this.height + other.radius;

// }
Wall.prototype.update = function () {

    NonLivingEntity.prototype.update.call(this);
    for (var i = 0; i < this.game.entities.length; i++) {
        if (!this.game.entities[i].nonLiving) {
            console.log(this.game.entities[i].name);
            if (this.collideTop(this.game.entities[i])) {
                console.log("TOP HIT!!");
            }
        }
    }
    // for (i = 0; i < this.game.entities; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && ent !== "Wall") {
    //         if (this.collide(ent)) {
    //             console.log("collision");
    //             if((ent.x - ent.radius < this.x + this.width) && ((this.y + this.height < ent.y - ent.radius) || (this.y + this.height > ent.y + ent.radius))) {
    //                 ent.x += 1;
    //             }
    //         }
    //     }
    // }
}

Wall.prototype.draw = function (ctx) {
    NonLivingEntity.prototype.draw.call(this, ctx);
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(this.x - this.game.getWindowX(), this.y - this.game.getWindowY(), this.width, this.height);
    ctx.fill();

}






