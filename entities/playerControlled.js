
// find and replace playerControlled with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()
// Source Used: http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/

function playerControlled(game) {
    this.player = 1;
    this.radius = 10;
    //this.rocks = 0;
    this.kills = 0;
    this.name = "playerControlled";
    this.color = "White";
    this.cooldown = 0;
  this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: 0, y: 0 };
};

playerControlled.prototype = new Entity();
playerControlled.prototype.constructor = playerControlled;

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

    var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
    var acceleration = 1000000000;
  
  if (this.game.keyState) {
    var x = 0;
    var y = 0;
    //left
    if (this.game.keyState[37]) {
      x = -1;
    }
    //up
    if (this.game.keyState[38]) {
      y = -1;
    }
    //right
    if (this.game.keyState[39]) {
      x = 1;
    }
    //down
    if (this.game.keyState[40]) {
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
  this.velocity.x -= this.velocity.x * dragPercent
  this.velocity.y -= this.velocity.y * dragPercent

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
            if (ent.name !== "Zombie" && ent.name !== "Rock") {
                var temp = { x: this.velocity.x, y: this.velocity.y };
                var dist = distance(this, ent);
                var delta = this.radius + ent.radius - dist;
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
            // if (ent.name === "Rock" && this.rocks < 2) {
                // this.rocks++;
                // ent.removeFromWorld = true;
            // }
        }
    }
    

    if (this.cooldown === 0 && this.action.throwRock ) { //&& this.rocks > 0) {
        this.cooldown = 1;
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
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};