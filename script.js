blocksList=[]
is3d=true;
function setup(){
  createCanvas(700,700,WEBGL);
  //blocksList=generateCity(10,[new Block(blockTypes.cityblock,50,50,400,400)])
  blocksList=[new Block(blockTypes.cityblock,50,50,600,600)]
  time=0;
  loops=0;
  //noLoop();
  //stroke(255);
  noStroke();
  cam=createCamera();
  setCamera(cam);
  perspective(PI/2.0 , width / height, 0.01, 5000);
  playerPos=createVector(0,0,0);
  playerRot=createVector(0,0,0);
  rotVel=createVector(0,0,0);
  playerVel=createVector(0,0,0);
}


function movePlayer(x,y,z){
  cam.move(x,y,z);
  playerPos=createVector(playerPos.x+x,playerPos.y+y,playerPos.z+z)
}
function rotPlayer(x,y,z){
  cam.pan(y);
  playerRot=createVector(playerRot.x+x,playerRot.y+y,playerRot.z+z)
}

function draw(){
  background(183, 217, 247);
  noFill();
  //drag to move the world.
  //orbitControl();

  blocksList.forEach(function(block){
    if(is3d){
      fill(block.type.color[0],block.type.color[1],block.type.color[2])
      push()
      translate(block.x+block.w/2,-block.type.height/2,block.y+block.h/2)
      box(block.w,block.type.height,block.h)
      pop()

      //check coll
      if(){

      }
    }else{
      fill(block.type.color[0],block.type.color[1],block.type.color[2])
      rect(block.x,block.y,block.w,block.h);
    }

  });


  if(is3d){
    //w
    if (keyIsDown(87)) {
        playerVel.z-=0.2;
    //a
    } else if (keyIsDown(65)) {
        playerVel.x-=0.2;
    //d
    } else if (keyIsDown(68)) {
        playerVel.x+=0.2;
    //s
    } else if (keyIsDown(83)) {
        playerVel.z+=0.2;
    }

    //space
    if (keyIsDown(32)) {
        playerVel.y-=0.5;
    }
    //shift
    if (keyIsDown(16)) {
        playerVel.y+=0.5;
    }
    movePlayer(playerVel.x,playerVel.y,playerVel.z);
    playerVel.mult(0.9);
    if(playerVel.mag()<0.005){
      playerVel.mult(0);
    }else if(playerVel.mag()>5){
      playerVel=playerVel.normalize().mult(5);
    }

    //up
    if (keyIsDown(LEFT_ARROW)) {
        //rotPlayer(0,(PI*2)*0.01,0);
        rotVel.y+=(PI*2)*0.003;
    //right
    } else if (keyIsDown(RIGHT_ARROW)) {
        //rotPlayer(0,-(PI*2)*0.01,0);
        rotVel.y-=(PI*2)*0.003;
    }
    rotPlayer(rotVel.x,rotVel.y,rotVel.z);
    rotVel.mult(0.85);
    if(rotVel.mag()<0.005){
      rotVel.mult(0);
    }else if(rotVel.mag()>2){
      rotVel=rotVel.normalize().mult(5);
    }


  }


  blocksList.forEach(function(block){
    if(!is3d){
      if(inBox(mouseX,mouseY,block.x,block.y,block.x+block.w,block.y+block.h)){
        fill(255)
        text(block.type.name+"("+Math.floor(block.w*block.h)+"m^2)",block.x,block.y);
      }
    }
  });


  time++
  if(time%2==0 && loops<26){
    loops++
    if(blocksList.length<10){
      blocksList=blockStep(blocksList,0);
    }else{
        blocksList=blockStep(blocksList,blocksList.length*0.65);
    }
  }
  fill(255)
  //text(loops,10,10);
}
