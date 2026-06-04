const fs = require('fs')

var coco = require('./Bottle.json')
console.log(coco)
var phaser = {frames:{}};

for (var key in coco.frames){
   var val = coco.frames[key];
   var frame = val.frame.replace(/{|}/g , '').split(',').map(function(x){return parseInt(x);});
   frame = {"x":frame[0],"y":frame[1],"w":frame[2],"h":frame[3]}

   var spriteOffset = val.offset.replace(/{|}/g , '').split(',').map(function(x){return parseInt(x);});
   spriteOffset = {"x" : spriteOffset[0], y:spriteOffset[1]};
   
   var rotated = val.rotated;

   var spriteSourceSize = val.sourceColorRect.replace(/{|}/g , '').split(',').map(function(x){return parseInt(x);});
   spriteSourceSize = {"x":spriteSourceSize[0],"y":spriteSourceSize[1],"w":spriteSourceSize[2],"h":spriteSourceSize[3]};

   var sourceSize = val.sourceSize.replace(/{|}/g , '').split(',').map(function(x){return parseInt(x);});
   sourceSize = {"w":sourceSize[0],"h":sourceSize[1]};

   phaser.frames[key] = {frame:frame, spriteOffset:spriteOffset, spriteSourceSize :spriteSourceSize, rotated:rotated, sourceSize:sourceSize }
}

fs.writeFile('myBottle.json', JSON.stringify(phaser), 'utf8', (err) => {
  console.log(err)
});