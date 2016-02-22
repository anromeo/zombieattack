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
    var other;
    for (var i = 0; i < this.game.entities.length; i++) {
        other = this.game.entities[i];
        if (!other.isNonLiving) {
        // console.log("Y: " + this.y + " < other.y: "  + other.y + " and other.radius: " + other.radius + " - " + (this.y < other.y + other.radius)); // if the object is less than the top's y-coordinate (top of object)
        // console.log("X:" + this.x + " < other.x: " + other.x + " and other.radius :" + other.radius + " - " + (this.x < other.x + other.radius)); // AND either if the right side of the object is greater than the the left side of this
        // console.log("X:" + this.x + " width: " + this.width + " and other.x: " + other.x + " minus other.radius " + other.radius + " - " + (this.x + this.width > other.x - other.radius)); // OR if the left side of the object is greater than  right side of this

        // console.log(this.game.entities[i].name);
            if ((this.y < other.y + other.radius) // if the object is less than the top's y-coordinate (top of object)
            && (this.y + this.height > other.y - other.radius) // AND if the oject's right hand side is higher than the bottom's y-coordinate (bottom of object)
            && (this.x < other.x + other.radius) // AND either if the right side of the object is greater than the the left side of this
            && (this.x + this.width > other.x - other.radius)) {
                if (this.collideTop(other)) {
                    other.y = this.y - other.radius;
                    console.log("TOP HIT!!");
                } else if (this.collideBottom(other)) {
                    other.y = this.y + this.height + other.radius;
                    console.log("Bottom HIT!!");
                } else if (this.collideLeft(other)) {
                    other.x = this.x - other.radius;
                    console.log("Left HIT!!");                    
                } else if (this.collideRight(other)) {
                    other.x = this.x + this.width + other.radius;
                    console.log("Left HIT!!");                    
                }
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
    ctx.fillStyle = "black";
    ctx.rect(this.x - this.game.getWindowX(), this.y - this.game.getWindowY(), this.width, this.height);
    ctx.fill();

}






