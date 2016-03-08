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
Wall.prototype.topCloseToOtherWall = function(otherWall, closeness) {

    var leftOther = otherWall.x;
    var rightOther = otherWall.x + otherWall.width;

    var leftThis = this.x;
    var rightThis = this.x + this.width;


    return ((this.y - closeness <= otherWall.y + otherWall.height) &&
        (leftThis <= leftOther && rightThis <= rightOther) ||
        (leftThis <= leftOther && rightOther <= rightThis));
}

Wall.prototype.bottomCloseToOtherWall = function(otherWall, closeness) {
    var leftOther = otherWall.x;
    var rightOther = otherWall.x + otherWall.width;

    var leftThis = this.x;
    var rightThis = this.x + this.width;


    return ((this.y + closeness >= otherWall.y) &&
        (leftThis <= leftOther && rightThis <= rightOther) ||
        (leftThis <= leftOther && rightOther <= rightThis));
}

Wall.prototype.leftCloseToOtherWall = function(otherWall, closeness) {
    var topOther = otherWall.y;
    var bottomOther = otherWall.y + otherWall.height;

    var topThis = this.y;
    var bottomThis = this.y + this.height;


    return ((this.x + closeness >= otherWall.x) &&
        (topThis <= topOther && bottomThis <= bottomOther) ||
        (topThis <= topOther && bottomOther <= bottomThis));
}

Wall.prototype.rightCloseToOtherWall = function(otherWall, closeness) {
    var topOther = otherWall.y;
    var bottomOther = otherWall.y + otherWall.height;

    var topThis = this.y;
    var bottomThis = this.y + this.height;


    return ((this.x - closeness <= otherWall.x + otherWall.width) &&
        (topThis <= topOther && bottomThis <= bottomOther) ||
        (topThis <= topOther && bottomOther <= bottomThis));
}

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
                if (other.type === "projectile") {
                    other.removeFromWorld = true;
                }
                var collideTop = this.collideTop(other);
                var collideBottom = this.collideBottom(other);
                var collideLeft = this.collideLeft(other);
                var collideRight = this.collideRight(other);

                var velocityY = Math.abs(other.velocity.y);
                var velocityX = Math.abs(other.velocity.x);

                if (collideTop && collideLeft) {
                    //console.log("CollideTop :" + collideTop + " | " )
                    if (velocityY < velocityX) {
                        other.y = this.y - other.radius;
                        other.velocity.y = 0;
                    } else {
                        other.x = this.x - other.radius;
                    }
                } else if (collideTop && collideRight) {
                    if (velocityY < velocityX) {
                        other.y = this.y - other.radius;
                        other.velocity.y = 0;
                    } else {
                        other.x = this.x + this.width + other.radius;
                        other.velocity.x = 0;
                    }
                } else if (collideBottom && collideLeft) {
                    if (velocityY < velocityX) {
                        other.y = this.y + this.height + other.radius;
                        other.velocity.y = 0;
                    } else {
                        other.x = this.x - other.radius;
                        other.velocity.x = 0;
                    }
                } else if (collideBottom && collideRight) {
                    if (velocityY < velocityX) {
                        other.y = this.y + this.height + other.radius;
                        other.velocity.y = 0;
                    } else {
                        other.x = this.x + this.width + other.radius;
                        other.velocity.x = 0;
                    }
                }else if (collideTop !== false) {
                     other.y = this.y - other.radius;
                     other.velocity.y = 0;
                } else if (collideBottom !== false) {
                     other.y = this.y + this.height + other.radius;
                     other.velocity.y = 0;
                } else if (collideLeft !== false) {
                     other.x = this.x - other.radius;
                     other.velocity.x = 0;
                } else if (collideRight !== false) {
                     other.x = this.x + this.width + other.radius;
                     other.velocity.x = 0;
                }
            }
        }

        // if ((this.y < other.y + other.radius + closeness) && this.collideTop(other, closeness) && other.name === "playerControlled") {
        //     console.log("Close to Top");
        // }

        // if ((this.y + this.height > other.y - other.radius - closeness) &&this.collideBottom(other, closeness) && this.name === "playerControlled") {
        //     console.log("Close to Bottom");
        // }
        //     if (closeToLeft && this.name === "playerControlled") {

        //     }
        //     if (closeToRight && this.name === "playerControlled") {

        //     }
        // }

        var wall;
        var topRepelOk = true;
        var bottomRepelOk = true;
        var leftRepelOk = true;
        var rightRepelOk = true;

        var closeness = 50;

        for (j = 0; j < this.game.map.walls.length; j++) {
            var otherWall = this.game.map.walls[j];
            if (otherWall !== this) {
                if (topRepelOk) {
                    topRepelOk = !this.topCloseToOtherWall(otherWall, closeness);
                }
                if (bottomRepelOk) {
                    bottomRepelOk = !this.bottomCloseToOtherWall(otherWall, closeness);
                }
                if (leftRepelOk) {
                    leftRepelOk = !this.leftCloseToOtherWall(otherWall, closeness);
                }
                if (rightRepelOk) {
                    rightRepelOk = !this.rightCloseToOtherWall(otherWall, closeness);
                }
            }
        }

        if ((this.y  - closeness < other.y + other.radius) // if the object is less than the top's y-coordinate (top of object)
            && (this.y + this.height + closeness > other.y - other.radius) // AND if the oject's right hand side is higher than the bottom's y-coordinate (bottom of object)
            && (this.x - closeness < other.x + other.radius) // AND either if the right side of the object is greater than the the left side of this
            && (this.x + this.width > other.x - other.radius - closeness)) {

            var closeToTop = this.collideTop(other, closeness);
            var closeToBottom = this.collideBottom(other, closeness);
            var closeToLeft = this.collideLeft(other, closeness);
            var closeToRight = this.collideRight(other, closeness);

            var difX = 0;
            var difY = 0;
            var acceleration = 10000000;

           if (!other.isNonLiving && other.type !== "projectile" && (other.type !== "playerControlled" || other.controlled === false) && other.velocity !== undefined) {
            // if (other.name === "playerControlled" && other.velocity !== undefined) {

                if (closeToTop && topRepelOk) {
                    var dist = distance({x: this.x + this.width / 2, y: this.y, radius: closeness}, other);
                    var difY = (this.y - (other.y - other.radius)) / dist;
                    other.velocity.y -= difY * acceleration / (dist * dist);
                }
                if (closeToBottom && bottomRepelOk) {
                    var dist = distance({x: this.x + this.width / 2, y: this.y + this.height, radius: closeness}, other);
                    var difY = (other.y + other.radius - this.y) / dist;
                    other.velocity.y += difY * acceleration / (dist * dist);
                }
                if (closeToLeft && leftRepelOk) {
                    var dist = distance({x: this.x, y: this.y + this.height / 2, radius: closeness}, other);
                    var difX = (this.x - (other.x + other.radius)) / dist;
                    other.velocity.x -= difX * acceleration / (dist * dist);
                }
                if (closeToRight && rightRepelOk) {
                    var dist = distance({x: this.x + this.width, y: this.y + this.height / 2, radius: closeness}, other);
                    var difX = ((other.x + other.radius) - this.x) / dist;
                    other.velocity.x += difX * acceleration / (dist * dist);
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
    ctx.fillStyle = "yellow";
    ctx.rect(this.x - this.game.getWindowX(), this.y - this.game.getWindowY(), this.width, this.height);
    ctx.fill();

}






