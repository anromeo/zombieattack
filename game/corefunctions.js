/**
 * Gets the distance between the two objects
 * @param a Object with an x and a y
 * @param b Object with an x and a y
 * @return float distance of the two objects
 */
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Gets the direction of a towards b
 * @param a Object with an x and a y
 * @param b Object with an x and a y
 * @return 
 */
function direction(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if(dist > 0) {
      return { x: dx / dist, y: dy / dist }; 
    } else {
      return {x:0,y:0};
    }
}

/**
 * Generates a random between 1 and n
 * @param n the limit that the random number gets to
 * @return int random number between 1 and n
 */
function randomInt(n) {
    return Math.floor(Math.random() * n);
}