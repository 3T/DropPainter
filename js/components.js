/*
-------------------------------------------------------------------------
Class Canvas
-------------------------------------------------------------------------
*/
var Canvas = function(width, height, parentElementId) {
  this.width = width;
  this.height = height;
  
  var parentElement = document.getElementById(parentElementId);  
  this.canvasElement = document.createElement("canvas");
  this.canvasElement.width = this.width;
  this.canvasElement.height = this.height;
  parentElement.appendChild(this.canvasElement);
  
  //コンテキストの生成
  this.ctx = this.canvasElement.getContext("2d");
};
Canvas.prototype.width;
Canvas.prototype.height;
Canvas.prototype.canvasElement;
Canvas.prototype.ctx;

Canvas.prototype = {
};

/*
-------------------------------------------------------------------------
Class Slider
-------------------------------------------------------------------------
*/
var Slider = function(id) {
  this.id = id;
  
  this.init();
};

Slider.prototype = {
  init: function() {
    this.sliderElement = document.getElementById(this.id);
    this.sliderBar = document.createElement("div");
    this.sliderBar.id = this.id + "_bar";
    this.sliderElement.appendChild(this.sliderBar);
    
    this.sliderBar.addEventListener("touchstart", this.touchStartHandler, true);
    this.sliderBar.addEventListener("touchmove", this.touchMoveHandler, true);
    this.sliderBar.addEventListener("touchend", this.touchEndHandler, true);
    
    this.value = 0;
  },
    
  touchStartHandler: function(event) {
    return false;
  },
      
  touchMoveHandler: function(event) {
    //縦スクロールを防ぐ
    event.preventDefault();
      
    if(!event){
      event = window.event;
    }

    for(var i=0; i<event.touches.length; i++){
      if(event.touches[i].target == this){
        var top = event.touches[i].pageY;
      }
      if(!top){
        return false;
      }
    }
    var rect = this.parentNode.getBoundingClientRect();
    this.value = Math.round(top - rect.top);
    //はみだし防止
    if(this.value < 0){
      this.value = 0;
    }
    else if(this.value > this.parentNode.clientHeight - this.clientHeight){
      this.value = this.parentNode.clientHeight - this.clientHeight;
    }
    
    //スライダーの場所を指定
    this.style.top = this.value + "px";
    this.innerHTML = this.value;

    return false;
  },
      
  touchEndhandler: function() {
    return false;
  }
};
