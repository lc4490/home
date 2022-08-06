seeds = [];
butterflies = [];
colors = [255];
flag = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  actualSetUp()
  
}
function keyPressed(){
  if (key == ' ')
    {actualSetUp()}
  flag = true
}
function actualSetUp(){
  
  size = 40;
  //setup dandefly objects
  for (let i = 0; i < 100; i++) {
    d = new Dandefly(0, 50, i);
    seeds[i] = d;
  }
  //setup butterly objects
  for (let i = 0; i < 100; i++) {
    sinValue = sin(radians(i * 20)) * size;
    cosValue = cos(radians(i * 20)) * size;
    b = new Butterfly(cosValue, sinValue, 255, i);
    butterflies[i] = b;
    if (i > 50) {
      size = 70;
    }
  }  
}

function mousePressed() {
  //starts moving the dandeflies
  if(flag){
  for (let i = 0; i < seeds.length; i++) {
    seeds[i].changeSpeed(mouseX,mouseY);
  }
    flag = false;
  }
  //starts moving the butterflies
  for (let i = 0; i < butterflies.length; i++) {
    butterflies[i].changeSpeed(mouseX,mouseY);
  }
}

function draw() {
  background("lightblue");
  push();
  translate(width / 2, height / 2);
  noFill();
  //draw stem
  stroke("forestgreen");
  arc(0, height / 4, 50, height / 2, PI / 2, (3 * PI) / 2);
  //draw butterflies
  for (let j = 0; j < butterflies.length; j++) {
    butterflies[j].display();
    butterflies[j].move();
  }
  //draw dandelion seeds
  for (let i = 0; i < seeds.length; i++) {
    stroke(255);
    seeds[i].display();
    seeds[i].move();
  }
  //draw center
  fill("lightyellow");
  stroke("lightyellow");
  ellipse(0, 0, 5, 5);
  pop();
}

class Dandefly {
  constructor(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.Xspd = 0;
    this.Yspd = 0;
    this.w = 25;
    this.h = 100;
    this.start = PI / 2;
    this.end = (3 * PI) / 2;
    this.rot = 1
  }
  display() {
    push();
    rotate(this.i);
    scale(this.rot,1)
    translate(this.x,this.y)
    arc(0, 0, this.w, this.h, this.start, this.end);
    fill(255);
    stroke(0);
    strokeWeight(0.5);
    pop();
  }
  changeSpeed(mx,my) {
    let range = 2;
    if(this.x> (mouseX-width/2) && this.y > (mouseY-height/2)){
      rotate(-this.i)
      this.Xspd =random(0,range)
      this.Yspd=random(0,range)
    }
    else if(this.x<(mouseX-width/2) && this.y >(mouseY-height/2)){
      this.Xspd=random(-range,0)
      this.Yspd=random(0,range)
    }
    else if(this.x<(mouseX-width/2) && this.y < (mouseY-height/2)){
      this.Xspd=random(-range,0)
      this.Yspd=random(-range,0)
    }
    else{
      this.Xspd=random(0,range)
      this.Yspd=random(-range,0)
    }
  }
  move() {
    push();
    //rotate(-this.i);
    this.x += this.Xspd;
    this.y += this.Yspd;
    pop();
  }
}

class Butterfly {
  constructor(x, y, c, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.x1 = 0 - 100;
    this.y1 = 0 - 25;
    this.x2 = 0;
    this.y2 = 0;
    this.x3 = 0 - 25;
    this.y3 = 0 - 100;
    this.x4 = 0 - 100;
    this.y4 = 0 - 125;
    this.c = c;
    this.sinValue = 0;
    this.mapValue = 1;
    this.flapFreq = random(15, 20);
    this.Xspd = 0;
    this.Yspd = 0;
    this.set = 0;
  }
  changeSpeed(mx,my) {
    let range = 2.5;
    if(this.x> (mx-width/2) && this.y > (my-height/2)){
      this.Xspd =random(0,range)
      this.Yspd=random(0,range)
    }
    else if(this.x<(mx-width/2) && this.y >(my-height/2)){
      this.Xspd=random(-range,0)
      this.Yspd=random(0,range)
    }
    else if(this.x<(mx-width/2) && this.y < (my-height/2)){
      this.Xspd=random(-range,0)
      this.Yspd=random(-range,0)
    }
    else{
      this.Xspd=random(0,range)
      this.Yspd=random(-range,0)
    }
    //this.Xspd=random(-range,range)
    //this.Yspd=random(-range,range)
    this.set = 1;
  }
  move() {
    push();
    rotate(-this.i);
    this.x += this.Xspd;
    this.y += this.Yspd;
    pop();
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.i);
    scale(0.175, 0.2);
    this.sinValue = sin(radians(frameCount * this.flapFreq));
    this.mapValue = map(this.sinValue, -1, 1, 0.5, 1);
    scale(Math.pow(this.mapValue, this.set), 1);
    fill(this.c);
    stroke(255/2);
    quad(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      this.x3,
      this.y3,
      this.x4,
      this.y4
    );
    quad(
      -this.x1,
      this.y1,
      -this.x2,
      this.y2,
      -this.x3,
      this.y3,
      -this.x4,
      this.y4
    );
    quad(
      this.x1,
      -this.y1,
      this.x2,
      -this.y2,
      this.x3,
      -this.y3,
      this.x4,
      -this.y4
    );
    quad(
      -this.x1,
      -this.y1,
      -this.x2,
      -this.y2,
      -this.x3,
      -this.y3,
      -this.x4,
      -this.y4
    );
    pop();
  }
}
