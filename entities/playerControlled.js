
// find and replace playerControlled with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()
// Source Used: http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/


function playerControlled(game) {
	//LivingEntity.call(this, game, 0, 0, 0, 0, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));	
	LivingEntity.call(this, game, 0, 0, 0, 0, game.surfaceWidth/2, game.surfaceHeight/2);
    this.player = 1;
	this.spriteWidth = 80;
	this.spriteHeight = 43;
    this.radius = 30;
    this.strength = 100;
    this.controlled = false;
    this.weapon = null;

    this.currentSpecialMove = null;
    this.specialMoves = null;

    this.game = game;
    this.name = "playerControlled";
    this.color = "Black";

    this.cooldown = 0;
    this.team = "blue";
    //this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]
    
	this.CenterOffsetX = 10; // puts the center of the sprite in the center of the entity
	this.CenterOffsetY = 10; // puts the center of the sprite in the center of the entity
	this.SpriteRotateOffsetX = 8; //describes the point of rotation on the sprite changed from 1/2 width
	this.SpriteRotateOffsetY = -7; //describes the point of rotation on the sprite changed from 1/2 height
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/Player2.png"), this.spriteWidth, this.spriteHeight, .05, 1, true, false, 1);
    this.velocity = { x: 0, y: 0 };
};

playerControlled.prototype = new LivingEntity();
playerControlled.prototype.constructor = playerControlled;


playerControlled.prototype.gameEffects = function() {
    if (this.freezingTime && this.freezingTime > 0) {
        var currentGameEntity;
        for (var i = 0; i < this.game.entities.length; i++) {
            currentGameEntity = this.game.entities[i];
            currentGameEntity.maxSpeed = 0;
        }
        this.freezingTime -= this.game.clockTick;
    }

    if (this.freezingTime && this.freezingTime < 0) {
        var currentGameEntity = null;
        for (var i = 0; i < this.game.entities.length; i++) {
            currentGameEntity = this.game.entities[i];
            // console.log(this.allEntitiesOldSpeeds[currentGameEntity]);
            currentGameEntity.maxSpeed = this.allEntitiesOldSpeeds[i];
        }
        this.freezingTime = null;
    }
}

// Freezes Time for the current entities
playerControlled.prototype.freezeTime = function () {
    if (!this.freezingTime || this.freezingTime < 0) {
        this.freezingTime = 6;
        this.allEntitiesOldSpeeds = new Array();
        var currentGameEntity;
        for (var i = 0; i < this.game.entities.length; i++) {
            currentGameEntity = this.game.entities[i];
            this.allEntitiesOldSpeeds[i] = currentGameEntity.maxSpeed;
            if (currentGameEntity.team != this.team) {
                if (this.name === "playerControlled") {
                    console.log("I am player controlled and have become frozen");
                }
                currentGameEntity.maxSpeed = 0;
            }
        }
        console.log(this.allEntitiesOldSpeeds);
    }
}

// This function will eventually move to the shooter class.
playerControlled.prototype.attack = function(dir) {

    rock = new Rock(this.game);
    rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
    rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
    rock.velocity.x = dir.x * rock.maxSpeed;
    rock.velocity.y = dir.y * rock.maxSpeed;
    rock.thrown = true;
    rock.thrower = this;
    this.game.addEntity(rock);

}
    /**
     * Calculates the point of interception for one object starting at point
     * <code>a</code> with speed vector <code>v</code> and another object
     * starting at point <code>b</code> with a speed of <code>s</code>.
     * 
     * @see <a
     *      href="http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/">Calculating
     *      an intercept course to a target with constant direction and velocity
     *      (in a 2-dimensional plane)</a>
     * 
     * @param a
     *            start vector of the object to be intercepted
     * @param v
     *            speed vector of the object to be intercepted
     * @param b
     *            start vector of the intercepting object
     * @param s
     *            speed of the intercepting object
     * @return vector of interception or <code>null</code> if object cannot be
     *         intercepted or calculation fails
     * 
     * @author Jens Seiler
     */
    playerControlled.prototype.calculateInterceptionPoint = function(a, v, b, s) {

        // x difference between a and b
        var ox = a.x - b.x;
        // y difference between a and b
        var oy = a.y - b.y;
//        console.log("X Diff: " + ox + " | Y Diff: " + oy);

        var h1 = v.x * v.x + v.y * v.y - s * s;
        var h2 = ox * v.x + oy * v.y;
        var t;
        // console.log("h1: " + h1 + " | h2: " + h2);

        if (h1 == 0) { // problem collapses into a simple linear equation 
            t = -(ox * ox + oy * oy) / 2*h2;
            // console.log(t); 
        } else { // solve the quadratic equation
            var minusPHalf = h2 / h1;
 
//            console.log(minusPHalf);
            var discriminant = minusPHalf * minusPHalf - (ox * ox + oy * oy) / h1; // term in brackets is h3

            if (discriminant < 0) { // no (real) solution then...
                return null;
            }
//            console.log(discriminant);
 
            var root = Math.sqrt(discriminant);
 
            var t1 = minusPHalf + root;
            var t2 = minusPHalf - root;
 
            var tMin = Math.min(t1, t2);
            var tMax = Math.max(t1, t2);
 
            t = tMin > 0 ? tMin : tMax; // get the smaller of the two times, unless it's negative
            if (t < 0) { // we don't want a solution in the past
                return null;
            }
        }
 
        // calculate the point of interception using the found intercept time and return it
        return answer = {x : (a.x + t * v.x), y : (a.y + t * v.y)};
    };




playerControlled.prototype.aiSelectAction = function() {
    
        this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]

        var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
        var acceleration = 1000000000;


        // This is the action the zombie will perform
        var action = { direction: { x: 0, y: 0 }, throwRock: true, target: null};
        var acceleration = 1000000000;


        // This is the target that the shooter will shoot
        var target = null;

        // This is the visual radius of how far the shooter can shoot
        this.visualRadius = 800;

        var ai = this;
        var x = 1000;
        var y = 1000 / 2;
        var length = 400;

        // This is the distance which will be used to calculate the target zombie
        var dist;

        // This is the distance of the canvas which determines the closest zombie to shoot
        var closest = 800;

        // for every zombie
        for (var i = 0; i < this.game.entities.length; i++) {

            // determine if the zombie is the closest zombie to the AI
            var ent = this.game.entities[i];

            // if the entity is not equal to this and the entity
            // does not have the same team as this
            // and the entity is not a NonLiving entity
            if (ent !== this && ent.team !== this.team &&  ent.name !== "FlameThrower" && ent.name !== "NonLiving") {
                dist = distance(ent, this);

                // if the distance is closer than the currently closest zombie
                if (dist < closest) {

                    // reassign the closest distance the target
                    closest = dist;
                    target = ent;
                }
            }
        }

        // the radius we are determining if the target is close enough to approach
        var zombRadius = 800;
        // the space between the shooter and his target
        var comfortZone = 200;

        // IF there exists a target closer than the closest
        // AND the closest zombie is close enough to the shooter
        if (target && this.collide({x: target.x, y: target.y, radius: zombRadius})) {

            // take the target's x and the target's y and divide it by the distance
            // numbers that will generally come out of this would be
            // difX < 1 and around .5 with a comfort zone of 400
            // difY > -1 and around -.4 with a comfort zone of 400
            var difX = (target.x - this.x) / dist;
            var difY = (target.y - this.y) / dist;

            // IF the shooter is closer than the shooter's comfort zone
            if (this.collide({x: target.x, y: target.y, radius: comfortZone})) {
                // add it to the direction of the next move and back away
                action.direction.x -= difX * acceleration * 2 / (dist * dist);
                action.direction.y -= difY * acceleration * 2 / (dist * dist);
            } else {
                // add it to the direction of the next move and get closer to the target
                action.direction.x += difX * acceleration * 2 / (dist * dist);
                action.direction.y += difY * acceleration * 2 / (dist * dist);
            }
        }

        // prevent the shooter from touching corners
        // for (var i = 0; i < 4; i++) {
        //     if (this.collide({ x: this.corners[i].x, y: this.corners[i].y, radius: this.visualRadius })) {
        //         dist = distance(this, this.corners[i]);
        //         var difX = (this.corners[i].x - this.x) / dist;
        //         var difY = (this.corners[i].y - this.y) / dist;
        //         action.direction.x -= difX * acceleration / (dist * dist);
        //         action.direction.y -= difY * acceleration / (dist * dist);
        //     }
        // }


        // // if the shooter is 200px away from either left or right side of the canvas
        // if (this.x <= (200 +  || this.x >= this.game.surfaceWidth - 200) {

        //     // create an invisible wall
        //     var wall;
        //     // if the x location of the shooter is less than 400px
        //     if (this.x < 400) {
        //         // let that wall be the left most border of the screen
        //         wall = {x: 0, y: this.y};
        //     } else {
        //         // else let that wall be the right most border of the screen
        //         wall = {x: this.game.surfaceWidth, y: this.y};
        //     }

        //     // get the distance between this object and the wall created
        //     var distWall = distance(this, wall);

        //     // let the difference of the wall help to simulate a magnetic repulsion
        //     var difX = (wall.x - this.x) / distWall;
        //     var difY = (wall.y - this.y) / distWall;
        //     action.direction.x -= difX * acceleration / (distWall * distWall);
        //     action.direction.y -= difY * acceleration / (distWall * distWall);        
        // }

        // // if the shooter is 200px away from either the top or bottom of the canvas
        // if (this.y <= 200 || this.y >= this.game.surfaceHeight - 200) {

        //     // create an invisible wall
        //     var wall;

        //     // if the y location of the shooter is less than 400px
        //     if (this.y < 400) {
        //         // let that wall be the top border of the canvas
        //         wall = {x: this.x, y: 0};
        //     } else {
        //         // else let that wall be the bottom border of the canvas
        //         wall = {x: this.x, y: this.game.surfaceHeight };
        //     }

        //     // let the difference of the wall help to simulate a magnetic repulsion from the wall
        //     var distWall = distance(this, wall);
        //     var difX = (wall.x - this.x) / distWall;
        //     var difY = (wall.y - this.y) / distWall;
        //     action.direction.x -= difX * acceleration / (distWall* distWall);
        //     action.direction.y -= difY * acceleration / (distWall* distWall);        
        // }

        // for every zombie
        for (var i = 0; i < this.game.entities.length; i++) {

            // determine if the zombie is the closest zombie to the AI
            var ent = this.game.entities[i];


            // if the entity is not equal to this and the entity
            // does not have the same team as this
            // and the entity is not a NonLiving entity
            if (ent !== this && ent.team !== this.team && ent.name !== "FlameThrower" && ent.name !== "NonLiving") {
                dist = distance(ent, this);

                // if the distance is closer than the currently closest zombie
                if (dist < closest) {

                    // reassign the closest distance the target
                    closest = dist;
                    target = ent;
                }
            }
        }

        // the number of pixels that the shooter is comfortable
        // with having another playable character
        var personalBubble = 50;

        // This will be the PlayerControlled object.
        // There will only ever be one fully PlayerControlled object.
        var player = null;

        // for every player controlled player on the board
        for (var i = 0; i < this.game.players.length; i++) {

            // get that playable character and the space between it and this playable character
            var playableCharacter = this.game.players[i];
            var space = distance(playableCharacter, this);

            // If this is the PlayerControlled object
            // but the PlayerControlled object is not this object
            if (this.game.players[i].controlled === true
                && this.game.players[i].controlled != this) {
                var player = this.game.players[i];
            }
//            console.log(space);
            // if the space is smaller than this playable character's personal bubble
            if (space > personalBubble) {

                // backaway from the other character
                var difX = (playableCharacter.x - this.x) / space;
                var difY = (playableCharacter.y - this.y) / space;
                action.direction.x -= difX * acceleration / (space * space);
                action.direction.y -= difY * acceleration / (space * space);
            }
        }


        // This is the highest distance of the space between the Friendly AI
        // and the PlayerControlled objects
        var spaceBetweenPlayerControlled = 275;

        // console.log(this);

        // console.log(player);
        // If the player exists and the player is moving outside of the
        // PlayerControlled object's space.
        if (player && !this.collide({x: player.x, y: player.y, radius: spaceBetweenPlayerControlled})) {

            // Then move the player closer to the Player Controlled Object
            var difX = (player.x - this.x) / spaceBetweenPlayerControlled;
            var difY = (player.y - this.y) / spaceBetweenPlayerControlled;
            action.direction.x += 100 * difX * acceleration / (spaceBetweenPlayerControlled * spaceBetweenPlayerControlled);
            action.direction.y += 100 * difY * acceleration / (spaceBetweenPlayerControlled * spaceBetweenPlayerControlled);
        }

        // if there exists a target
        if (target) {

            // calculate where the zombie will be in order to determine where the target of the shot will be
            action.target = this.calculateInterceptionPoint(target, target.velocity, this, 200);
            console.log("NAME: " + target.name + " | TEAM: " + target.team);
            action.target.x = action.target.x - this.radius;
            action.target.y = action.target.y - this.radius;
            
            action.throwRock = true;
       }
        action.direction.x -= (1 - friction) * this.game.clockTick * this.directionX;
        action.direction.y -= (1 - friction) * this.game.clockTick * this.directionY;

        return action;
}
// Swaps the player controlled if possible and if pressed
playerControlled.prototype.swapIfCanSwap = function(game) {


    var indexOfSwappingPlayerControlled;
    var offset = 49;

    for (var i = 0; i < 9; i++) {
        if (game.keyState[i + offset]) {
            indexOfSwappingPlayerControlled = i;
        }
    }

    // if '1' through '9' is pressed
    // AND this.players[whatever-was-pressed - 1]
    // exists, then swap control to that PlayerControlled
    // object
    if (indexOfSwappingPlayerControlled >= 0
        && indexOfSwappingPlayerControlled <= 57
        && game.players[indexOfSwappingPlayerControlled]
        && !game.players[indexOfSwappingPlayerControlled].controlled) {

        for(var i = 0; i < game.players.length; i++) {
            game.players[i].controlled = false;
        }
        game.players[indexOfSwappingPlayerControlled].controlled = true;
        console.log("SWAPPED");
    }
}

playerControlled.prototype.selectAction = function () {

    if (!this.controlled) {
        return this.aiSelectAction();
    }

    if (this.controlled) {
        var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
        var acceleration = 1000000000;
      
    	if (this.game.keyState) {
    		var x = 0;
    		var y = 0;

            // If the player has pressed a key '1' to '9' then swap players if
            // the other player exists
            this.swapIfCanSwap(this.game);            
            if (this.game.keyState[32]) {
                this.currentSpecialMove();
            }

    		//left
    		if (this.game.keyState[37]||this.game.keyState[65]||this.game.keyState[97]) { //leftarrow, a, A
    			x = -1;
    		}
    		//up
    		if (this.game.keyState[38]||this.game.keyState[87]||this.game.keyState[119]) {  //uparrow, w, W
    			y = -1;
    		}
    		//right
    		if (this.game.keyState[39]||this.game.keyState[68]||this.game.keyState[100]) {  //rightarrow, d, D
    			x = 1;
    		}
    		//down
    		if (this.game.keyState[40]||this.game.keyState[83]||this.game.keyState[115]) {  //downarrow, s, S
    			y = 1;
    		}	
    		
    		action.direction.x += (x) * acceleration;
    		action.direction.y += (y) * acceleration;
    	}
      
        if (this.game.click) {    
            action.target = this.game.click;
            action.throwRock = true;
            this.game.click = null;
        }
      
        return action;
    }
};

// do not change code beyond this point

playerControlled.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

// playerControlled.prototype.collideLeft = function () {
//     return (this.x - this.radius) < 0;
// };

// playerControlled.prototype.collideRight = function () {
//     return (this.x + this.radius) > this.game.surfaceWidth;
// };

// playerControlled.prototype.collideTop = function () {
//     return (this.y - this.radius) < 0;
// };

// playerControlled.prototype.collideBottom = function () {
//     return (this.y + this.radius) > this.game.surfaceHeight;
// };


playerControlled.prototype.collideLeft = function () {
    return (this.x - this.CenterOffsetX - this.game.getWindowX()) < 0;
};

playerControlled.prototype.collideRight = function () {
   return (this.x - this.CenterOffsetX - this.game.getWindowX()) > 672;
};

playerControlled.prototype.collideTop = function () {
   return (this.y - this.CenterOffsetY - this.game.getWindowY()) < 0;
};

playerControlled.prototype.collideBottom = function () {
   return (this.y - this.CenterOffsetY - this.game.getWindowY()) > 526;
};

playerControlled.prototype.aiUpdate = function() {
        Entity.prototype.update.call(this);
    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);

    // if (drag.y > action.direction.y) drag.y = action.direction.y;
    // if (drag.x > action.direction.x) drag.x = action.direction.x;
    // action.direction.x -= drag.x;
    // action.direction.y -= drag.y;
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;
  //drag
  var dragPercent = 0.05;
  this.velocity.x -= this.velocity.x * dragPercent;
  this.velocity.y -= this.velocity.y * dragPercent;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    } 
  // else if (speed < 0) {
    // this.velocity.x *= 0;
        // this.velocity.y *= 0;
  // }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 900 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 900 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && this.collide(ent)) {
    //         if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving") {
    //             var temp = { x: this.velocity.x, y: this.velocity.y };
    //             var dist = distance(this, ent);
    //             var delta = this.radius + ent.radius - dist;
    //             var difX = (this.x - ent.x) / dist;
    //             var difY = (this.y - ent.y) / dist;

    //             this.x += difX * delta / 2;
    //             this.y += difY * delta / 2;
    //             ent.x -= difX * delta / 2;
    //             ent.y -= difY * delta / 2;

    //             this.velocity.x = ent.velocity.x * friction;
    //             this.velocity.y = ent.velocity.y * friction;
    //             ent.velocity.x = temp.x * friction;
    //             ent.velocity.y = temp.y * friction;
    //             this.x += this.velocity.x * this.game.clockTick;
    //             this.y += this.velocity.y * this.game.clockTick;
    //             ent.x += ent.velocity.x * this.game.clockTick;
    //             ent.y += ent.velocity.y * this.game.clockTick;
    //         }
    //         // if (ent.name === "Rock" && this.rocks < 2) {
    //             // this.rocks++;
    //             // ent.removeFromWorld = true;
    //         // }
    //     }
    // }
    
    var rock;
    // if (!this.controlled) {
    //     console.log(this.action);
    // }
    if (this.cooldown === 0 && this.action.throwRock) { //&& this.rocks > 0) {
        if (this.controlled) {
            this.cooldown = .25;
        } else {
            this.cooldown = .75;
        }
        //this.rocks--;
        var target = this.action.target;
        var dir = null;
        if (target != null && (this.controlled === true || (target.x < 780 && target.x > 20))) {
          dir = direction(target, this);
          this.attack(dir);
        }        
    }

    if (this.action.target) {
        this.angle = Math.atan2(this.action.target.x, this.action.target.y) * (180/Math.PI);
        this.angle = this.angle - 100;
        //console.log(this.angle);
        while (this.angle > 360) {
            this.angle = this.angle - 360;
        }
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
}

playerControlled.prototype.update = function () {

    this.gameEffects();
    if (!this.specialMoves) {
        this.specialMoves = new Array();
        this.specialMoves[0] = this.freezeTime;
        this.currentSpecialMove = this.specialMoves[0];
    }
    if (!this.controlled) {
        this.aiUpdate();
        return;
    }

    // console.log(this.game.playerX + " " + this.game.playerY);

    Entity.prototype.update.call(this);

    // Weapon collision
    for (i = 0; i < this.game.weapons.length; i++) {
        var weap = this.game.weapons[i];
        if (!(((this.y + 54) < (weap.y)) ||
        (this.y > (weap.y + 20))||
        ((this.x + 54) < weap.x) ||
        (this.x > (weap.x + 50)))) {
            weap.removeFromWorld = true;
            this.weapon = weap.name;
        }
    }


    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);

    // if (drag.y > action.direction.y) drag.y = action.direction.y;
    // if (drag.x > action.direction.x) drag.x = action.direction.x;
    // action.direction.x -= drag.x;
    // action.direction.y -= drag.y;
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;
  //drag
  var dragPercent = 0.05;
  this.velocity.x -= this.velocity.x * dragPercent;
  this.velocity.y -= this.velocity.y * dragPercent;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    } 
  // else if (speed < 0) {
    // this.velocity.x *= 0;
        // this.velocity.y *= 0;
  // }

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = this.game.surfaceWidth - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = this.game.surfaceHeight - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    // Removed by Vlad, stupid loop makes the game crash

    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && this.collide(ent)) {
    //         if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving") {
    //             var temp = { x: this.velocity.x, y: this.velocity.y };
    //             var dist = distance(this, ent);
    //             var delta = this.radius + ent.radius - dist;

    //             if (dist) {
    //                 var difX = (this.x - ent.x) / dist;
    //                 var difY = (this.y - ent.y) / dist;


    //                 this.x += difX * delta / 2;
    //                 this.y += difY * delta / 2;
    //                 ent.x -= difX * delta / 2;
    //                 ent.y -= difY * delta / 2;

    //                 this.velocity.x = ent.velocity.x * friction;
    //                 this.velocity.y = ent.velocity.y * friction;
    //                 ent.velocity.x = temp.x * friction;
    //                 ent.velocity.y = temp.y * friction;
    //                 this.x += this.velocity.x * this.game.clockTick;
    //                 this.y += this.velocity.y * this.game.clockTick;
    //                 ent.x += ent.velocity.x * this.game.clockTick;
    //                 ent.y += ent.velocity.y * this.game.clockTick;
    //             }
    //         }
    //         // if (ent.name === "Rock" && this.rocks < 2) {
    //             // this.rocks++;
    //             // ent.removeFromWorld = true;
    //         // }
    //     }
    // }

    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && this.collide(ent)) {
    //         if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving") {
    //             var temp = { x: this.velocity.x, y: this.velocity.y };
    //             var dist = distance(this, ent);
    //             var delta = this.radius + ent.radius - dist;
    //             var difX = (this.x - ent.x) / dist;
    //             var difY = (this.y - ent.y) / dist;

    //             this.x += difX * delta / 2;
    //             this.y += difY * delta / 2;
    //             ent.x -= difX * delta / 2;
    //             ent.y -= difY * delta / 2;

    //             this.velocity.x = ent.velocity.x * friction;
    //             this.velocity.y = ent.velocity.y * friction;
    //             ent.velocity.x = temp.x * friction;
    //             ent.velocity.y = temp.y * friction;
    //             this.x += this.velocity.x * this.game.clockTick;
    //             this.y += this.velocity.y * this.game.clockTick;
    //             ent.x += ent.velocity.x * this.game.clockTick;
    //             ent.y += ent.velocity.y * this.game.clockTick;
    //         }
    //         // if (ent.name === "Rock" && this.rocks < 2) {
    //             // this.rocks++;
    //             // ent.removeFromWorld = true;
    //         // }
    //     }
    // }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.team !== this.team && ent.name !== "Rock" && ent.name !== "FlameThrower" && ent.name !== "NonLiving") {
                var temp = { x: this.velocity.x, y: this.velocity.y };
                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;

                if (dist) {
                    var difX = (this.x - ent.x) / dist;
                    var difY = (this.y - ent.y) / dist;


                    this.x += difX * delta / 2;
                    this.y += difY * delta / 2;
                    ent.x -= difX * delta / 2;
                    ent.y -= difY * delta / 2;

                    this.velocity.x = ent.velocity.x * friction;
                    this.velocity.y = ent.velocity.y * friction;
                    ent.velocity.x = temp.x * friction;
                    ent.velocity.y = temp.y * friction;
                    this.x += this.velocity.x * this.game.clockTick;
                    this.y += this.velocity.y * this.game.clockTick;
                    ent.x += ent.velocity.x * this.game.clockTick;
                    ent.y += ent.velocity.y * this.game.clockTick;
                }
            }
            // if (ent.name === "Rock" && this.rocks < 2) {
                // this.rocks++;
                // ent.removeFromWorld = true;
            // }
        }
    }
    
    var rock;
    var flame;
    // if (!this.controlled) {
    //     console.log(this.action);
    // }
    if (this.cooldown === 0 && this.action.throwRock ) { //&& this.rocks > 0) {
        if (this.controlled) {
            this.cooldown = .25;
        } else {
            this.cooldown = .75;
        }
        //this.rocks--;
        var target = this.action.target;
        var dir = null;
        if (target != null && (this.controlled === true || (target.x < 780 && target.x > 20))) {
          dir = direction(target, this);
        }        
        if (dir != null) {

          if (this.weapon === "FlameThrower") {
          flame = new Flame(this.game, ASSET_MANAGER.getAsset("./images/flame2.png"));
          flame.x = this.x + dir.x * (this.radius + flame.radius + 20);
          flame.y = this.y + dir.y * (this.radius + flame.radius + 20);
          flame.velocity.x = dir.x * flame.maxSpeed;
          flame.velocity.y = dir.y * flame.maxSpeed;
          flame.thrown = true;
          flame.thrower = this;
          this.game.addEntity(flame);

          } else {
          rock = new Rock(this.game);
          rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
          rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
          rock.velocity.x = dir.x * rock.maxSpeed;
          rock.velocity.y = dir.y * rock.maxSpeed;
          rock.thrown = true;
          rock.thrower = this;
          this.game.addEntity(rock);
        }
        }
    }

    if (this.action.target) {
        this.angle = Math.atan2(this.action.target.x, this.action.target.y) * (180/Math.PI);
        this.angle = this.angle - 100;
        //console.log(this.angle);
        while (this.angle > 360) {
            this.angle = this.angle - 360;
        }
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

    if (flame) {
        var Distance = distance(this, flame);
        console.log(Distance);
    }

};

playerControlled.prototype.draw = function (ctx) {
    if (this.controlled) {
    	this.game.setWindowX(this.x - 400);
    	this.game.setWindowY(this.y - 400);
    }
    // ctx.beginPath();
    // ctx.fillStyle = this.color;
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // ctx.fill();
    // ctx.closePath();
    //console.log(this.game.mouse.clientX);
	
	// ctx.beginPath();
 //    ctx.fillStyle = "grey";
 //    ctx.arc(300 - this.game.getWindowX(), 300 - this.game.getWindowY(), this.radius, 0, Math.PI * 2, false);
 //    ctx.fill();
 //    ctx.closePath();

	
    LivingEntity.prototype.draw.call(this, ctx);
};
