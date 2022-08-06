let butterflies=[];
let pixels=[];
let flag = true;

function preload() {
  butterfly = loadImage("img/butterfly.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

}
function mousePressed(){
  if(flag == true){
  while(butterflies.length>0){
    butterflies.splice(0,1);
  }
  size=40;
  for (let i = 0; i < 100; i++) {
    sinValue = sin(radians(i * 20)) * size;
    cosValue = cos(radians(i * 20)) * size;
    b = new Butterfly(width/2+cosValue, height/2+sinValue,i);
    butterflies.push(b);
    if (i > 50) {
      size = 70;
    }
  }
}
flag = false;
}

function draw() {
  push();
  background(0);
  for (let j = 0; j < butterflies.length; j++) {
    butterflies[j].display();
    butterflies[j].move();
  }
  pop();

}

class Butterfly{
  constructor(x,y,i,c){
    // if(x-width/2 > 0){
    //   this.x = width;
    // }
    // else{
    //   this.x=0;
    // }
    // if(y-width/2 > 0){
    //   this.y = width;
    // }
    // else{
    //   this.y=0;
    // }
    if(random(1) >0.5){
      this.x=random(-10,0);
    }
    else{
      this.x=random(width, width+10);
    }
    if(random(1) >0.5){
      this.y=random(-10,0);
    }
    else{
      this.y=random(height, height+10);
    }
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
    this.range = 25;
  }
  display() {
    push();
    translate(this.x, this.y);
    scale(0.1);
    rotate(this.i);
    // tint(255,250);
    this.sinValue = sin(radians(frameCount * this.flapFreq));
    this.mapValue = map(this.sinValue, -1, 1, 0.5, 1);
    scale(Math.pow(this.mapValue, this.set), 1);
    image(butterfly,-butterfly.width/2,0);
    // stroke(255/2);
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
    this.xDist = this.x-this.destX;
    this.yDist = this.y-this.destY;
    this.xSpd = map(this.xDist, 0, width, 10, 20);
    this.ySpd = map(this.yDist, 0, width, 10, 20);
    if(this.xDist > this.range || this.xDist < -this.range || this.yDist > this.range || this.yDist < this.range){
      if(this.xDist > this.range){
        this.x -= this.Xspd;
      }
      else if(this.xDist < -this.range){
        this.x += this.Xspd;
      }
      else{
        // this.Xspd = 0;
      }

      if(this.yDist > this.range){
        this.y -= this.Yspd;
      }
      else if(this.yDist < -this.range){
        this.y += this.Yspd;
      }
      else{
        // this.Yspd = 0;
      }
    }

    else {
      this.set = 0;
      rotate(-this.i);
    }
    // this.x += this.Xspd;
    // this.y += this.Yspd;
    pop();
  }
  resetXY(x,y){
    this.destX=x;
    this.destY=y;
    this.Xspd = random(0,2);
    this.Yspd = random(0,2);
  }
}
