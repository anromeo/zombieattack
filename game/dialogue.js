function Dialogue(game, name, dialogue, img, time, rightSide) {
    this.game = game;
    this.name = name;
    this.dialogue = dialogue;
    this.img = ASSET_MANAGER.getAsset(img);
    this.timer = new Timer();
    this.time = time;
    this.removeFromWorld = false;
    this.rightSide = rightSide;
}

// Dialogue.prototype.drawDialogue = function(ctx) {
//     this.timer.tick();

//     var margin = 20;
//     var imageWidth = 100;
//     var imageHeight = 100;

//     // ctx.drawImage(this.img, margin, this.surfaceHeight - margin, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);

//     var width = this.surfaceWidth - imageWidth - margin;
//     var height = 100;

//     ctx.fillStyle = "white";
//     ctx.strokeStyle = "black";
//     roundRect(ctx, 100, this.surfaceHeight - height - margin, width, height, 10, true, true);
// }

// Dialogue.prototype.drawDialogue = function(ctx) {
//     //if (playerIsSpeaking)
//     var width = this.surfaceWidth - 120;
//     var height = 100;
//     ctx.fillStyle = "white";
//     ctx.strokeStyle = "black";
//     roundRect(ctx, 100, this.surfaceHeight - height - 20, width, height, 10, true, true);
// }
