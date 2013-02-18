/*
-------------------------------------------------------------------------
Class Painter
-------------------------------------------------------------------------
*/
var Painter = function() {
  this.penSize = 5;
  this.drawColor = {red: 0, green: 0, blue: 0, alpha: 1};
  this.changedColor = {red: 0, green: 0, blue: 0, alpha: 1};
  this.isDrawColor = true;
  
  this.pos = {x: 0, y:0};
  this.prevPos = {x:0, y:0};
};

Painter.prototype.pos;
Painter.prototype.prevPos;

Painter.prototype.drawColor;
Painter.prototype.changedColor;
Painter.prototype.isDrawColor;

Painter.prototype.penSize;

Painter.prototype.ctx;

Painter.prototype = {
  //eventから座標をとりだす
  dumpEvent: function(event, target) {
    if(!event){
      event = window.event;
    } 
    for(var i=0; i<event.touches.length; i++){
      if(event.touches[i].target == target){
      //target上に置いてある指の、target上の座標を返す
      this.pos = {x:event.touches[i].pageX - target.offsetLeft, y:event.touches[i].pageY - target.offsetTop};
      return this.pos;
      }
    }
  },
      
  getPos: function() {
    return this.pos;
  },
      
  setPos: function(position) {
    this.pos = position;
  },
      
  getPrevPos: function() {
    return this.prevPos;
  },
  
  //座標の保存    
  setPrevPos: function(position) {
    this.prevPos = position;
  },
      
  //オブジェクト保持の色を、rgba値で返す。引数は選択している色。
  getRGBA: function(isDrawColor) {
    if(isDrawColor){
      return "rgba(" + this.drawColor.red + "," + this.drawColor.green + "," + this.drawColor.blue + "," + this.drawColor.alpha +")";
    }
    else{
      return "rgba(" + this.changedColor.red + "," + this.changedColor.green + "," + this.changedColor.blue + "," + this.changedColor.alpha +")";
    }
  },
      
  //オブジェクト保持の色を、rgb値で返す。引数は選択している色
  getRGB: function(isDrawColor) {
    if(isDrawColor){
      return "rgb(" + this.drawColor.red + "," + this.drawColor.green + "," + this.drawColor.blue + ")";
    }
    else{
      return "rgb(" + this.changedColor.red + "," + this.changedColor.green + "," + this.changedColor.blue + ")";
    }
  },
  
  setColorRed: function(num, isDrawColor) {
    num = Number(num);
    if(num > 255){
      num = 255;
    }
    else if(num < 0){
      num = 0;
    }
        
    if(isDrawColor){
      this.drawColor.red = num;
    }
    else {
      this.changedColor.red = num;
    }
  },
      
  getColorRed: function(isDrawColor) {
    if(isDrawColor){
      return this.drawColor.red;
    }
    else{
      return this.changedColor.red;
    }
  },
      
  setColorGreen: function(num, isDrawColor) {
    num = Number(num);
    if(num > 255){
      num = 255;
    }
    else if(num < 0){
      num = 0;
    }
        
    if(isDrawColor){
      this.drawColor.green = num;
    }
    else {
      this.changedColor.green = num;
    }
  },
      
  getColorGreen: function(isDrawColor) {
    if(isDrawColor){
      return this.drawColor.green;
    }
    else{
      return this.changedColor.green;
    }
  },

  setColorBlue: function(num, isDrawColor) {
    num = Number(num);
    if(num > 255){
      num = 255;
    }
    else if(num < 0){
      num = 0;
    }
        
    if(isDrawColor){
      this.drawColor.blue = num;
    }
    else {
      this.changedColor.blue = num;
    }
  },

  getColorBlue: function(isDrawColor) {
    if(isDrawColor){
      return this.drawColor.blue;
    }
    else{
      return this.changedColor.blue;
    }
  },
      
  setColorAlpha: function(num, isDrawColor) {
    num = Number(num);
    if(num > 1){
      num = 1;
    }
    else if(num < 0){
      num = 0;
    }
        
    if(isDrawColor){
      this.drawColor.alpha = num;
    }
    else {
      this.changedColor.alpha = num;
    }
  },
      
  getColorAlpha: function(isDrawColor) {
    if(isDrawColor){
      return this.drawColor.alpha;
    }
    else{
      return this.changedColor.alpha;
    }
  }
};