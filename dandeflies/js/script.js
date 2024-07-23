let cam;
let butterflies=[];
let pixels=[];

function preload() {
  butterfly = loadImage("img/butterfly.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.hide();
  scale(-1,1);
  setupFaceDetection();
  yStart = 0;
  xStart = 0;
  yHeight = height;
  xWidth = width;
}

function draw() {
  push();
  background(0);
  updateFaceDetection();
  image(cam,0,0,width,height*640/480);

  for (let i = 0; i < faces.length; i++) {
    let f = faces[i];

    // rect(f.x*width/cam.width, (f.y+f.height/2)*height/cam.height*(640/480), f.width*width/cam.width, (f.height-f.height/2)*height/cam.height*(640/480));
    // yStart = (f.y+f.height/2)*height/cam.height*(640/480);
    // xStart = f.x*width/cam.width;
    // yHeight = (f.height-f.height/2)*height/cam.height*(640/480);
    // xWidth = (f.width)*width/cam.width;
    gridSize = 10;
    for(let y = yStart; y < yStart+yHeight; y +=gridSize){
      for(let x = xStart; x < xStart+xWidth; x+=gridSize)
        {
          // ellipse(x,y,gridSize);
          let index = (x + y * cam.width)*4;
          let r = cam.pixels[index+0];
          let g = cam.pixels[index+1];
          let b = cam.pixels[index+2];
          let a = cam.pixels[index+3];

          let avg = (r+b+g)/3;
          if(avg >255*0.5 &&
          x > f.x && y > (f.y+f.height/2) && x < f.x+f.width && y < f.y+(f.height)){
            pixels.push([x*width/cam.width,y*height/cam.height*(640/480)]);

            //test ellipses
            // fill(255);
            // stroke(255);
            // ellipse(x*width/cam.width,y*height/cam.height*(640/480),gridSize);
          }

        }
    }

    // randx = floor(random(100));
    // randy = floor(random(100));
    // mapX = map(randx, 0, 100, xStart, xWidth);
    // mapY = map(randy, 0, 100, yStart,yHeight);
    // ellipse(mapX,mapY,15);


  }

  for (let j = 0; j < butterflies.length-1; j++) {
    butterflies[j].resetXY(pixels[pixels.length-j-1][0],pixels[pixels.length-j-1][1]);
    butterflies[j].display();
    butterflies[j].move();
  }
  cam.loadPixels();
  // yStart = 0;
  // xStart = 0;
  // yHeight = cam.height;
  // xWidth = cam.width;


  while(pixels.length > 200){
    pixels.splice(0,1);
  }
  while(butterflies.length > pixels.length){
    butterflies.splice(0,1);
  }
  for(let i = 0; i < 200; i++){
    if(butterflies.length < pixels.length){
    b = new Butterfly(pixels[i][0],pixels[i][1], floor(random(100)));
    butterflies.push(b);
  }
}

  cam.updatePixels();
}


function keyPressed(){
  if(key == " "){
  while(butterflies.length > 0){
    butterflies.splice(0,1);
  }
}
}

function mousePressed() {
while(pixels.length > 100){
  pixels.splice(0,1);
}
while(butterflies.length > pixels.length){
  butterflies.splice(0,1);
}
for(let i = 0; i < 100; i++){
  if(butterflies.length < pixels.length){
  b = new Butterfly(pixels[i][0],pixels[i][1], i);
  butterflies.push(b);
}
}

}

class Butterfly{
  constructor(x,y,i,c){
    this.x=mouseX+random(-width,width);
    this.y=mouseY+random(-height,height);
    this.destX = x;
    this.destY = y;
    this.i=i;
    this.sinValue = 0;
    this.mapValue = 1;
    this.flapFreq = random(15, 20);
    this.Xspd = random(0,2);
    this.Yspd = random(0,2);
    this.set = 1;
    this.xDist = 0;
    this.yDist = 0;
    this.c = c;
    this.range = 15;
  }
  display() {
    push();
    translate(this.x, this.y);
    scale(0.15);
    rotate(this.i);
    this.sinValue = sin(radians(frameCount * this.flapFreq));
    this.mapValue = map(this.sinValue, -1, 1, 0.5, 1);
    scale(Math.pow(this.mapValue, this.set), 1);
    image(butterfly,-butterfly.width/2,0);
    pop();
  }
  changeSpeed() {
    let range = 2;
    this.set=1
    this.Xspd=random(-range,range);
    this.Yspd=random(-range,range);
  }
  move() {
    push();
    // rotate(-this.i);
    this.xDist = (this.x-this.destX);
    this.yDist = (this.y-this.destY);
    this.xSpd = map(this.xDist, 0, width, 10, 100);
    this.ySpd = map(this.yDist, 0, width, 10, 100);
    if(this.xDist > this.range || this.xDist < -this.range || this.yDist > this.range || this.yDist < this.range){
      if(this.xDist > this.range){
        this.x -= this.Xspd;
      }
      else if(this.xDist < -this.range){
        this.x += this.Xspd;
      }

      if(this.yDist > this.range){
        this.y -= this.Yspd;
      }
      else if(this.yDist < -this.range){
        this.y += this.Yspd;
      }
    }

    else {
      this.set = 0;
      rotate(-this.i);
    }
    pop();
  }
  resetXY(x,y){
    this.destX=x;
    this.destY=y;
    this.xDist = this.x-this.destX;
    this.yDist = this.y-this.destY;
    // this.Xspd = random(0,2.5);
    // this.Yspd = random(0,2.5);
    this.xSpd = map(this.xDist, 0, width, 10, 100);
    this.ySpd = map(this.yDist, 0, width, 10, 100);

  }
}
///////////
let detector;
let classifier = objectdetect.frontalface;
let img;
let detectedFaces; // name changed
let imgScale = 4;

function setupFaceDetection() {
  let w = 640;
  let h = 480;
  let scaleFactor = 1.2;
  detector = new objectdetect.detector(
    w / imgScale,
    h / imgScale,
    scaleFactor,
    classifier
  );
}

function updateFaceDetection() {
  let img = cam.get(0, 0, cam.width, cam.height);
  if (img.width > 1) {
    detectedFaces = detector.detect(img.canvas);
  }
  if (detectedFaces) {
    faces = [];
    detectedFaces.forEach(function (face) {
      let count = face[4];
      if (count > 4) {
        // try different thresholds
        // rect(face[0], face[1], face[2], face[3]);
        faces.push(
          new Face(
            face[0] * imgScale,
            face[1] * imgScale,
            face[2] * imgScale,
            face[3] * imgScale
          )
        );
      }
    });
  }
}

function displayFaceDetection() {
  push();
  scale(imgScale);
  stroke(255);
  noFill();
  if (detectedFaces) {
    detectedFaces.forEach(function (face) {
      let count = face[4];
      if (count > 4) {
        // try different thresholds
        rect(face[0], face[1], face[2], face[3]);
      }
    });
  }
  pop();
}

class Face {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.centerX = x + w / 2;
    this.centerY = y + h / 2;
  }
}
