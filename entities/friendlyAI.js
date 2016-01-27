
// find and replace friendlyAI with your initials (i.e. ABC)
// change this.name = "Your Chosen Name"

// only change code in selectAction function()
// Source Used: http://jaran.de/goodbits/2011/07/17/calculating-an-intercept-course-to-a-target-with-constant-direction-and-velocity-in-a-2-dimensional-plane/
function friendlyAI(game) {
    this.player = 1;
    this.radius = 10;
    this.rocks = 0;
    this.kills = 0;
    this.name = "friendlyAI";
    this.color = "Grey";
    this.cooldown = 0;
    this.corners = [{x:0, y:0}, {x:800, y:0}, {x:0, y:800}, {x:800, y:800}]
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));

    this.velocity = { x: 0, y: 0 };
};

friendlyAI.prototype = new Entity();
friendlyAI.prototype.constructor = friendlyAI;

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

friendlyAI.prototype.selectAction = function () {

    var action = { direction: { x: 0, y: 0 }, throwRock: false, target: null};
    var acceleration = 1000000000;
    var closest = 1000;
    var targetZombie = null;
    this.visualRadius = 500;
  this.zombieRadius = 50;
  this.closeZombieRadius = 30;
  this.cornerRadius = 300;
  
  var nearZombie = false;

    for (var i = 0; i < this.game.zombies.length; i++) {
        var thisZombie = this.game.zombies[i];
        var dist = distance(thisZombie, this);
        if (dist < closest) { //dist < 100
            closest = dist;
            targetZombie = thisZombie;
        }
        if (this.collide({x: thisZombie.x, y: thisZombie.y, radius: this.zombieRadius})) {
            var difX = (thisZombie.x - this.x) / dist;
            var difY = (thisZombie.y - this.y) / dist;
            action.direction.x -= difX * acceleration / (dist * dist);
            action.direction.y -= difY * acceleration / (dist * dist);
      if (this.collide({x: thisZombie.x, y: thisZombie.y, radius: this.closeZombieRadius})) {
        nearZombie = true;
      } 
        }
    }

  if (!nearZombie) {
    //console.log("not near zombie");
    // for (var i = 0; i < 4; i++) {
      // if (this.collide({ x: this.corners[i].x, y: this.corners[i].y, radius: this.cornerRadius })) {
        // var dist = distance(this, this.corners[i]);
        // var difX = (this.corners[i].x - this.x) / dist;
        // var difY = (this.corners[i].y - this.y) / dist;
        // action.direction.x -= difX * acceleration / (dist * dist);
        // action.direction.y -= difY * acceleration / (dist * dist);
      // }
    // }
    
    //test for rocks
    // console.log("rock length: " + this.game.rocks.length);
    // var rockCount = 0;
    // for (var i = 0; i < this.game.rocks.length; i++) {
      // if (!this.game.rocks[i].removeFromWorld) rockCount++;
    // }    
    // console.log("rocks in world: " + rockCount);
    // console.log(this.game.rocks.length);
    //!thisRock.thrown &&
    for (var i = 0; i < this.game.rocks.length; i++) {
      var thisRock = this.game.rocks[i];//this.rocks < 2
      if (!thisRock.removeFromWorld &&  this.rocks < 3 && this.collide({ x: thisRock.x, y: thisRock.y, radius: this.visualRadius })) {
        var dist = distance(this, thisRock);
        if (dist > this.radius + thisRock.radius) {
          var difX = (thisRock.x - this.x) / dist;
          var difY = (thisRock.y - this.y) / dist;
          action.direction.x += (difX  / (dist) ) * acceleration;
          action.direction.y += (difY  / (dist) ) * acceleration;
        }
      }
    }
  }


  ////calculate where the zombie will be
    if (targetZombie && !targetZombie.removeFromWorld && 0 === this.cooldown && this.rocks > 0 && nearZombie) { 
    action.target = this.calculateInterceptionPoint(targetZombie, targetZombie.velocity, this, Rock.maxSpeed);
        action.throwRock = true;
    }
  
  if (targetZombie && !targetZombie.removeFromWorld && 0 === this.cooldown && this.rocks > 1) { 
    action.target = this.calculateInterceptionPoint(targetZombie, targetZombie.velocity, this, Rock.maxSpeed);
        action.throwRock = true;
    }
  
    return action;
};

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
  friendlyAI.prototype.calculateInterceptionPoint = function(a, v, b, s) {
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

// do not change code beyond this point

friendlyAI.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

friendlyAI.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

friendlyAI.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

friendlyAI.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

friendlyAI.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

friendlyAI.prototype.update = function () {
    Entity.prototype.update.call(this);
    // console.log(this.velocity);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    this.action = this.selectAction();
    //if (this.cooldown > 0) console.log(this.action);
    this.velocity.x += this.action.direction.x;
    this.velocity.y += this.action.direction.y;

    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }

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
            if (ent.name === "Rock" && this.rocks < 2) {
                this.rocks++;
                ent.removeFromWorld = true;
            }
        }
    }
    

    if (this.cooldown === 0 && this.action.throwRock && this.rocks > 0) {
        this.cooldown = 1;
        this.rocks--;
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

friendlyAI.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};