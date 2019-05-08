class BlockType {
  constructor(name,color,height) {
        this.name = name;
        this.color=color;
        this.height=height;
  }
  genInfo(){
    return {name:"A Name"}
  }
}
blockTypes={
  //city level
  cityblock:new BlockType("cityblock",[100,100,100],1),
  park:new BlockType("park",[100,150,100],15),
  road:new BlockType("road",[50,50,50],5),

  //block level
  smallcityblock:new BlockType("smallcityblock",[120,120,100],1),
  alley:new BlockType("alley",[80,80,80],5),
  shop:new BlockType("shop",[100,100,150],70),
  house:new BlockType("house",[150,100,100],40),

  //building level
  //for house
  houseroom:new BlockType("houseroom",[180,100,100],40),
  wall:new BlockType("wall",[120,120,120],40),
  bedroom:new BlockType("bedroom",[150,150,100],40),
  kitchen:new BlockType("kitchen",[150,150,200],40),
  livingroom:new BlockType("livingroom",[180,180,120],40)
}

class Block{
  constructor(type,x,y,w,h,vertical=true){
    this.type=type
    this.x=x
    this.y=y
    this.w=w
    this.h=h
    this.v=vertical
    this.info=this.type.genInfo()
  }
  clone(){
    return new Block(this.type,this.x,this.y,this.w,this.h);
  }
}




class ChangeRule {
  constructor(inBlock,outBlock,minSize,maxSize,chance) {
        this.inBlock=inBlock;
        this.outBlock=outBlock;
        this.minSize=minSize;
        this.maxSize=maxSize;
        this.chance=chance
  }
  tryToChange(block){
    var area=block.w*block.h;
    if(block.type==this.inBlock && random()<this.chance && area<this.maxSize && area>this.minSize){
      block.type=this.outBlock;
    }
    return block
  }
}

changeRules=[
  new ChangeRule(blockTypes.cityblock,blockTypes.park,10,200*200,0.05),
  new ChangeRule(blockTypes.cityblock,blockTypes.smallcityblock,0,150*150,1),
  new ChangeRule(blockTypes.smallcityblock,blockTypes.house,0,50*50,0.6),
  new ChangeRule(blockTypes.smallcityblock,blockTypes.shop,0,50*50,0.6),
  new ChangeRule(blockTypes.houseroom,blockTypes.bedroom,0,15*15,0.6),
  new ChangeRule(blockTypes.houseroom,blockTypes.livingroom,0,15*15,0.6),
  new ChangeRule(blockTypes.houseroom,blockTypes.kitchen,0,15*15,0.6)
]





class SplitRule {
  constructor(inBlock,outBlocks,outBlocksSizes,chance=1) {
        this.inBlock=inBlock;
        this.outBlocks=outBlocks;
        this.outBlocksSizes=outBlocksSizes;
        this.chance=chance;
  }
  tryToSplit(block){
    var blocksRes=[]
    //try to keep everything squareish
    if(block.w<block.h && block.v){block.v=false}

    if(block.type==this.inBlock && random()<this.chance){
      //randomly swap blocks
      if(random()>0.5){var tmp=this.outBlocks[0];this.outBlocks[0]=this.outBlocks[2];this.outBlocks[2]=tmp;}
      //if vertical block
      if(block.v){
        var width=block.w;
        var widths=[];
        widths[0]=width*random(this.outBlocksSizes[0][0],this.outBlocksSizes[0][1]);
        widths[1]=width*random(this.outBlocksSizes[1][0],this.outBlocksSizes[1][1]);
        widths[2]=width-widths[0]-widths[1];
        blocksRes=[
          new Block(this.outBlocks[0],block.x,block.y,widths[0],block.h,false),
          new Block(this.outBlocks[1],block.x+widths[0],block.y,widths[1],block.h,false),
          new Block(this.outBlocks[2],block.x+widths[0]+widths[1],block.y,widths[2],block.h,false),
        ]
      }else{
        var height=block.h;
        var heights=[];
        heights[0]=height*random(this.outBlocksSizes[0][0],this.outBlocksSizes[0][1]);
        heights[1]=height*random(this.outBlocksSizes[1][0],this.outBlocksSizes[1][1]);
        heights[2]=height-heights[0]-heights[1];
        blocksRes=[
          new Block(this.outBlocks[0],block.x,block.y,block.w,heights[0],true),
          new Block(this.outBlocks[1],block.x,block.y+heights[0],block.w,heights[1],true),
          new Block(this.outBlocks[2],block.x,block.y+heights[0]+heights[1],block.w,heights[2],true),
        ]
      }
    }else{
      blocksRes=[block.clone()]
    }
    return blocksRes
  }
}

splitRules=[
  new SplitRule(blockTypes.cityblock,[blockTypes.cityblock,blockTypes.road,blockTypes.cityblock],[[0.3,0.7],[0.1,0.1]]),
  new SplitRule(blockTypes.smallcityblock,[blockTypes.smallcityblock,blockTypes.alley,blockTypes.smallcityblock],[[0.4,0.6],[0.05,0.05]],0.3),
  new SplitRule(blockTypes.houseroom,[blockTypes.houseroom,blockTypes.wall,blockTypes.houseroom],[[0.45,0.55],[0.02,0.02]],0.3),
  new SplitRule(blockTypes.house,[blockTypes.houseroom,blockTypes.wall,blockTypes.houseroom],[[0.45,0.55],[0.02,0.02]]),
  new SplitRule(blockTypes.houseroom,[blockTypes.bedroom,blockTypes.wall,blockTypes.kitchen],[[0.45,0.55],[0.02,0.02]],0.5),
  new SplitRule(blockTypes.houseroom,[blockTypes.bedroom,blockTypes.wall,blockTypes.livingroom],[[0.45,0.55],[0.02,0.02]],0.5),
  new SplitRule(blockTypes.houseroom,[blockTypes.kitchen,blockTypes.wall,blockTypes.livingroom],[[0.45,0.55],[0.02,0.02]],0.5)
]




function checkBlock(blockToCheck){
  //check change rules
  blockChanged=false
  for(c=0;c<changeRules.length;c++){
    rule=changeRules[c];

    blockTypeBefore=blockToCheck.type
    //changes block type in place
    rule.tryToChange(blockToCheck)

    if(blockTypeBefore!=blockToCheck.type){
      blockChanged=true;
      console.log("change!")
      break;
    }else{
      console.log("no change!")
    }

  }


  if(!blockChanged){
    //check split rules
    for(c=0;c<splitRules.length;c++){
      rule=splitRules[c];
      blockListToReturn=rule.tryToSplit(blockToCheck);
      if(blockListToReturn.length>1){
        console.log("split!")
        break;
      }else{
        console.log("no split!")
      }
    }
  }else{
    //if block has changed
    blockListToReturn=[blockToCheck]
  }
  return blockListToReturn;
}


function blockStep(blocks,blockCheckLim=0){
  blocksToCheck=blocks
  blocksToReturn=[]
  while(blocksToCheck.length>blockCheckLim){
    //sort blocks in ascending order by area
    blocksToCheck.sort((a,b)=> ((a.w*a.h)-(b.w*b.h)) );
    //sort blocks in ascending order by width vs height diff
    //blocksToCheck.sort((a,b)=> (Math.abs((a.w-a.h)/(a.w*a.h))-Math.abs((b.w-b.h)/(b.w*b.h)) ));

    //get biggest block & check it
    resBlocks=checkBlock(blocksToCheck.pop());
    //concat result of checkBlock with blocks
    blocksToReturn=blocksToReturn.concat(resBlocks);
  }
  blocksToReturn=blocksToReturn.concat(blocksToCheck)
  return blocksToReturn;
}

function generateCity(iters,blocks){
  for(i=0;i<iters;i++){
    console.log("Iteration "+i);
    blocks=blockStep(blocks);
  }
  return blocks;
}
