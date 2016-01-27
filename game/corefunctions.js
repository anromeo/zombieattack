
// GameBoard code below

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function direction(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if(dist > 0) return { x: dx / dist, y: dy / dist }; else return {x:0,y:0};
}

function randomInt(n) {
    return Math.floor(Math.random() * n);
}