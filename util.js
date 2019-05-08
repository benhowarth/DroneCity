function inBox(x,y,x1,y1,x2,y2){
  return( ((x>x1 && x<x2) || (x<x1 && x>x2)) && ((y>y1 && y<y2) || (y<y1 && y>y2)) )
}
