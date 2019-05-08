blocksList=[]
is3d=true;
var divInfo;
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
  cam.setPosition(0,0,0)
  setCamera(cam);
  perspective(PI/2.0 , width / height, 0.01, 5000);
  playerPos=createVector(0,0,0);
  playerRot=createVector(0,0,0);
  rotVel=createVector(0,0,0);
  playerVel=createVector(0,0,0);

  rotPlayer(0,PI*-0.75,0);
  movePlayer(0,-100,0);

  divInfo=createDiv("INFO\n");
}


function movePlayer(x,y,z){
  cam.move(x,y,z);
  var xDiff=(cos(-playerRot.y)*x)+(sin(playerRot.y)*z);
  var zDiff=(cos(playerRot.y)*z)+(sin(-playerRot.y)*x);
  playerPos.x=playerPos.x+xDiff;
  playerPos.y=playerPos.y+y;
  playerPos.z=playerPos.z+zDiff;
}
function rotPlayer(x,y,z){
  cam.pan(y);
  playerRot.x=(playerRot.x+x)%(2*PI)
  playerRot.y=(playerRot.y+y)%(2*PI)
  playerRot.z=(playerRot.z+z)%(2*PI)
}

function draw(){
  divInfo.html("INFO <br/> PlayerPos <br/>"+playerPos+"<br/> <br/> PlayerVel<br/>"+playerVel+"<br/> <br/> PlayerRot<br/>"+playerRot+" <br/> <br/> BlockPos <br/>"+blocksList[0].x+","+0+","+blocksList[0].y)
  background(183, 217, 247);
  noFill();

  //draw player box
  push()
  fill(100,100,100)
  translate(playerPos.x,playerPos.y-4,playerPos.z)
  rotateY(time*0.1)
  box(3,5,3)
  pop()


  if(is3d){
    //w
    if (keyIsDown(87)) {
        playerVel.z-=0.2;
    }
    //a
    if (keyIsDown(65)) {
        playerVel.x-=0.2;
    }
    //d
    if (keyIsDown(68)) {
        playerVel.x+=0.2;
    }
    //s
    if (keyIsDown(83)) {
        playerVel.z+=0.2;
    }

    //space
    if (keyIsDown(32)) {
        playerVel.y-=0.3;
    }
    //shift
    if (keyIsDown(16)) {
        playerVel.y+=0.3;
    }
    playerVel.mult(0.9);
    if(playerVel.mag()<0.005){
      playerVel.mult(0);
    }else if(playerVel.mag()>5){
      playerVel=playerVel.normalize().mult(5);
    }

    //up
    if (keyIsDown(LEFT_ARROW)) {
        //rotPlayer(0,PI/2,0);
        //rotPlayer(0,(PI*2)*0.01,0);
        rotVel.y+=(PI*2)*0.003;
    //right
    } else if (keyIsDown(RIGHT_ARROW)) {
        //rotPlayer(0,-PI/2,0);
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









  //drag to move the world
  //orbitControl();
  blocksList.forEach(function(block){
    if(is3d){
      fill(block.type.color[0],block.type.color[1],block.type.color[2])

      //check coll
      collVec=block.collide(playerPos,playerVel).mult(10)
      if(collVec.mag()>0.1){
        //fill(255,0,0)
        playerVel.x*=collVec.x;
        playerVel.y*=collVec.y;
        playerVel.z*=collVec.z;
      }
      push()
      translate(block.x+block.w/2,-block.type.height/2,block.y+block.h/2)
      box(block.w,block.type.height,block.h)
      pop()
    }else{
      fill(block.type.color[0],block.type.color[1],block.type.color[2])
      rect(block.x,block.y,block.w,block.h);
    }

  });





  movePlayer(playerVel.x,playerVel.y,playerVel.z);


  blocksList.forEach(function(block){
    if(!is3d){
      if(inBox(mouseX,mouseY,block.x,block.y,block.x+block.w,block.y+block.h)){
        fill(255)
        text(block.type.name+"("+Math.floor(block.w*block.h)+"m^2)",block.x,block.y);
      }
    }
  });


  time++
  if(time%2==0 && loops<20){
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
