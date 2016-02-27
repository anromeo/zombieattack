function Node(x, y) {
    this.x = x;
    this.y = y;
    this.neighbors = [];
}

function Grid(map) {
    var world = [[]];
    // var arr;
    // map.walls.forEach(function(wall) {
    //     var xStart = (wall.x  - (wall.x % 50));
    //     var xEnd = (wall.x + wall.width - ((wall.x + wall.width) % 50));
    //     var yStart = (wall.y - (wall.y % 50));
    //     var yEnd = (wall.y + wall.height - ((wall.y + wall.height) % 50));
    //     // console.log("wallStart: X - " + xStart + " | Y - " + yStart);
    //     // console.log("wallEnd: X - " + xEnd + " | Y - " + yEnd);

    //     for (xStart; xStart <= xEnd; xStart += 50) {
    //         var x = xStart;
    //         if (arr.x === undefined) {
    //             arr.x = {xStart => []};
    //         }
    //         for (yStart; yStart <= yEnd; yStart += 50) {
    //             var y = yStart;
    //             if (arr.x.xStart === undefined) {
    //                 arr[x] = [];
    //                 arr[x][y] = true;
    //             } else { 
    //                 arr[x][y] = true;
    //             }
    //             arr[x][y] = true;
    //             if (arr[x][y]) {
    //                 console.log("wall: X - " + x + " | Y - " + y );
    //             }
    //         }
    //     }
    //   });
    // console.log(arr);

    //     console.log("wall: X - " + (wall.x  - (wall.x % 50)) + " | Y - " + (wall.y - (wall.y % 50)));
    // });
    // arr.forEach(function(x) {
    //     x.forEach(function(y, value){
    //         if (arr[x] && arr[x][y]) {
    //             console.log("X: " + x + " | Y: " + y + " = " + "true");
    //         } else {
    //             console.log("X: " + x + " | Y: " + y + " = " + "false");
    //         }
    //     });
    // });
    for (var x = 0; x <= map.width; x += 50) {
        for (var y = 0; y <= map.height; y += 50) {

        }
    }
}