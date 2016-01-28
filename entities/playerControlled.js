
// find and replace playerControlled with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()
// Source Used: http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/

function playerControlled(game) {
    this.player = 1;
    this.radius = 30;
    this.strength = 50;
    this.controlled = false;
    //this.rocks = 0;
    this.kills = 0;
    this.game = game;
    this.name = "playerControlled";
    this.color = "Black";
    this.cooldown = 0;
    this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]
    LivingEntity.call(this, game, 0, 0, 0, 0, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    this.setMovingAnimation(ASSET_MANAGER.getAsset("./images/Player2.png"), 80, 43, .05, 1, true, false, 1);
    this.velocity = { x: 0, y: 0 };
};

playerControlled.prototype = new LivingEntity();
playerControlled.prototype.constructor = playerControlled;

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
        var ox = a.x - b.x;
        var oy = a.y - b.y;
 
        var h1 = v.x * v.x + v.y * v.y - s * s;
        var h2 = ox * v.x + oy * v.y;
        var t;
        if (h1 == 0) { // problem collapses into a simple linear equation 
            t = -(ox * ox + oy * oy) / 2*h2;
        } else { // solve the quadratic equation
            var minusPHalf = -h2 / h1;
 
            var discriminant = minusPHalf * minusPHalf - (ox * ox + oy * oy) / h1; // term in brackets is h3
            if (discriminant < 0) { // no (real) solution then...
                return null;
            }
 
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
// alter the code in this function to create your agent
// you may check the state but do not change the state of these variables:
//    this.rocks
//    this.cooldown
//    this.x
//    this.y
//    this.velocity
//    this.game and any of its properties

// you may access a list of zombies from this.game.zombies
// you may access a list of rocks from this.game.rocks
// you may access a list of players from this.game.players

playerControlled.prototype.selectAction = function () {
    if (this.controlled) {
        var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
        var acceleration = 1000000000;
      
    	if (this.game.keyState) {
    		var x = 0;
    		var y = 0;
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
    } else {
        var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
        var acceleration = 1000000000;
        var closest = 1000;
        var target = null;
        this.visualRadius = 200;
        var dist = 100;
        var me = this;
        var x = 1000;
        var y = 1000 / 2;
        var length = 400;
        var angle_stepsize = .009;

        for (var i = 0; i < this.game.zombies.length; i++) {
            var ent = this.game.zombies[i];
            dist = distance(ent, this);
            if (dist < closest) {
                closest = dist;
                target = ent;
            }
            var zombRadius = 150;
            if (this.game.zombies.length < 10) {
                zombRadius = 800;
            }
            if (this.collide({x: ent.x, y: ent.y, radius: zombRadius})) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                if (this.rocks === 2 && this.game.zombies.length < 10 && dist > 100 && 0 === this.cooldown) {
                    action.direction.x += difX * acceleration * 2 / (dist * dist);
                    action.direction.y += difY * acceleration * 2 / (dist * dist);
                } else {
                    action.direction.x -= difX * acceleration * 2 / (dist * dist);
                    action.direction.y -= difY * acceleration * 2 / (dist * dist);
                }
            }
        }

        if (this.game.zombies.length > 10) {
            if(this.angle < 2 * Math.PI)
            {
                action.direction.x += length * Math.cos(this.angle);
                action.direction.y += length * Math.sin(this.angle);

                 this.angle += angle_stepsize;
            } else {
                 this.angle = 0;
            }
        }

        var rock;
        var distRock = 200;
        for (var i = 0; i < this.game.rocks.length; i++) {
            var ent = this.game.rocks[i];
            if (!rock) {
                rock = ent;
            }
            if (!ent.removeFromWorld && dist > 200 && this.rocks < 2 && this.collide({ x: ent.x, y: ent.y, radius: 800 })) {
                distRock = distance(this, ent);
                if ((distRock > this.radius + ent.radius) && dist >= 50 && this.game.zombies.length < 10) {
                    var difX = (ent.x - this.x) / distRock;
                    var difY = (ent.y - this.y) / distRock;
                    action.direction.x += difX * acceleration * 2 / (distRock * distRock);
                    action.direction.y += difY * acceleration  * 2 / (distRock * distRock);
                }
            }
        }

        for (var i = 0; i < 4; i++) {
            if (this.collide({ x: this.corners[i].x, y: this.corners[i].y, radius: this.visualRadius }) && distRock > 75) {
                dist = distance(this, this.corners[i]);
                var difX = (this.corners[i].x - this.x) / dist;
                var difY = (this.corners[i].y - this.y) / dist;
                action.direction.x -= difX * acceleration / (dist * dist);
                action.direction.y -= difY * acceleration / (dist * dist);
            }
        }


        if (distRock > 150 && this.rocks < 2 && (this.x <= 200 || this.x >= 600)) {
            var wall;
            if (this.x < 400) {
                wall = {x: 0, y: this.y};
            } else {
                wall = {x: 800, y: this.y};
            }
            var distWall = distance(this, wall);
            var difX = (wall.x - this.x) / distWall;
            var difY = (wall.y - this.y) / distWall;
            action.direction.x -= difX * acceleration / (distWall * distWall);
            action.direction.y -= difY * acceleration / (distWall * distWall);        
        }

        if (distRock > 150 && this.rocks < 2 && (this.y <= 200 || this.y >= 600)) {
            var wall;
            if (this.y < 400) {
                wall = {x: this.x, y: 0};
            } else {
                wall = {x: this.x, y: 800};
            }
            var distWall = distance(this, wall);
            var difX = (wall.x - this.x) / distWall;
            var difY = (wall.y - this.y) / distWall;
            action.direction.x -= difX * acceleration / (distWall* distWall);
            action.direction.y -= difY * acceleration / (distWall* distWall);        
        }
        //calculate where the zombie will be
        if (target && !target.removeFromWorld && 0 === this.cooldown && (distance(target, this) <= 800)) {
            action.target = this.calculateInterceptionPoint(target, target.velocity, this, 200);
            action.throwRock = true;
        }      
        return action;
    }
};

// do not change code beyond this point

playerControlled.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

playerControlled.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

playerControlled.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

playerControlled.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

playerControlled.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

playerControlled.prototype.update = function () {
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
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.name !== "Zombie" && ent.name !== "Rock" && ent.name !== "NonLiving") {
                var temp = { x: this.velocity.x, y: this.velocity.y };
                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
                var difX = (this.x - ent.x) / dist;
                var difY = (this.y - ent.y) / dist;

                console.log(ent.name);
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
            // if (ent.name === "Rock" && this.rocks < 2) {
                // this.rocks++;
                // ent.removeFromWorld = true;
            // }
        }
    }
    

    if (this.cooldown === 0 && this.action.throwRock ) { //&& this.rocks > 0) {
        this.cooldown = .25;
        //this.rocks--;
        var target = this.action.target;
    var dir = null;
    if (target != null) {
      dir = direction(target, this);
    }        
    if (dir != null) {
      var rock = new Rock(this.game);
      rock.x = this.x + dir.x * (this.radius + rock.radius + 20);
      rock.y = this.y + dir.y * (this.radius + rock.radius + 20);
      rock.velocity.x = dir.x * rock.maxSpeed;
      rock.velocity.y = dir.y * rock.maxSpeed;
      rock.thrown = true;
      rock.thrower = this;
      this.game.addEntity(rock);
    }
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

playerControlled.prototype.draw = function (ctx) {
    // ctx.beginPath();
    // ctx.fillStyle = this.color;
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // ctx.fill();
    // ctx.closePath();
    //console.log(this.game.mouse.clientX);
    LivingEntity.prototype.draw.call(this, ctx);
};