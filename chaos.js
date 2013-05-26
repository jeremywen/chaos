// http://www.html5rocks.com/en/tutorials/canvas/performance/
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var visibleCanvas;
var visibleContext;
var lastChaosMap;

var width = 800,
  height = 1000,
  halfWidth = width / 2,
  halfHeight = height / 2,
  iterations = 100000,
  boxSize = 1;//Math.floor(Math.random()*10)+1;

canvas.width = width;
canvas.height = height;

function rndColorAlpha() {
  return 'rgba(' + rn(0, 255) + ',' + rn(0, 255) + ',' + rn(0, 255) + ',' + Math.random() + ')';
}

function rndColor() {
  return 'rgb(' + rn(0, 255) + ',' + rn(0, 255) + ',' + rn(0, 255) + ')';
}


function rn(low, high) {
  if (high) {
    return Math.floor(Math.random() * (high - low)) + low;
  }
  return Math.floor(Math.random() * low);
}


function runPaintCanvasLoop(chaosMap) {
  console.log("chaosMap = %o", chaosMap);
  console.log("starting to paint %d iterations...", iterations);

  var dir = 0,
    currentX = 0,
    currentY = 0;
  for (var i = 0; i < iterations; i++) {
    dir = rn(chaosMap.points.length);

    currentX = (currentX + chaosMap.points[dir].x) / chaosMap.divider;
    currentY = (currentY + chaosMap.points[dir].y) / chaosMap.divider;

    if (i > 20) {
      ctx.fillStyle = chaosMap.lingrad;
      ctx.fillRect(currentX, currentY, boxSize, boxSize);

      //reflect
      ctx.fillStyle = chaosMap.lingrad2;
      ctx.fillRect(width - currentX, currentY, boxSize, boxSize);

      if (chaosMap.reflections == 4) {
        //reflect
        ctx.fillStyle = chaosMap.lingrad;
        ctx.fillRect(width - currentX, height - currentY, boxSize, boxSize);

        //reflect
        ctx.fillStyle = chaosMap.lingrad2;
        ctx.fillRect(currentX, height - currentY, boxSize, boxSize);
      }
    }

    // for ( var j = 0; j < pointCount; j++ ) { 
    chaosMap.points[0].y += Math.cos(i) * chaosMap.multiSin;
    chaosMap.points[0].x += Math.sin(i) * chaosMap.multiSin;
    // }
  }
  lastChaosMap = chaosMap;
}


function paintCanvas() {

  var color1 = rndColor();
  var color2 = rndColor();
  var color3 = rndColor();
  var color4 = rndColor();

  var lingrad = ctx.createLinearGradient(0, 0, width, height);
  lingrad.addColorStop(0, color1);
  lingrad.addColorStop(1, color2);
  lingrad.addColorStop(Math.random(), color3);
  lingrad.addColorStop(Math.random(), color4);

  var lingrad2 = ctx.createLinearGradient(0, 0, width, height);
  lingrad2.addColorStop(0, color1);
  lingrad2.addColorStop(1, color2);
  lingrad2.addColorStop(Math.random(), color3);
  lingrad2.addColorStop(Math.random(), color4);

  var points = [],
    pointCount = rn(3, 20),
    divider = rn(2, 5),
    multiSin = rn(40, 500);

  // triangle
  // points.push({x:0,y:0});
  // points.push({x:0,y:height});
  // points.push({x:width,y:height});
  // points.push({x:width,y:0});
  for (var j = 0; j < pointCount; j++) {
    //between -1,1
    points.push({
      x: rn(width),
      y: rn(height),
      weight: 1.0
    });
  }

  runPaintCanvasLoop({
    points: points,
    divider: divider,
    multiSin: multiSin,
    reflections: 4,
    lingrad: lingrad,
    lingrad2: lingrad2
  });

  var visibleCanvas = document.getElementById('canvas');
  var visibleContext = visibleCanvas.getContext('2d');
  visibleCanvas.width = width*1.0;
  visibleCanvas.height = height*1.0;
  visibleContext.drawImage(canvas, 0, 0, visibleCanvas.width, visibleCanvas.height);

  var data = visibleCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  document.getElementById("downloadLink").setAttribute("href", data);
  console.log("done painting.");
}


function clearCanvas() {
  // ctx.fillStyle = Math.random() < 0.5 ? "white" : "black";
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
}

function regen(){
  clearCanvas();
  paintCanvas();
}

regen();
