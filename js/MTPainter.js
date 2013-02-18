
//定数
var MAX_STEP = 10;      //Undoの最大数
var LAYER_DEPTH = 1;    //レイヤーの最大数

var drawing = false;          //描画中フラグ
var gradating = false;
var accPos = {x:1, y:1};
var accPrevPos = {x:0, y:0};

var accelerating = false;

var painter = new Painter();

var currentLayer = 0; //現在のレイヤ
var layerBuffers; //レイヤ（キャンバス）を格納する配列

var canvas; //キャンバス
var ctx;    //コンテキスト

//ツール
var tool;  //ツール変数

//ツール
var penTool = new PenTool();
var brushTool = new BrushTool();
var rectTool = new RectTool();
var eraserTool = new EraserTool();

var penSize;
var foregroundColor = "rgb(0, 0, 0)"; //描画色
var changedColor ="rgb(0, 0, 0)";

var canvasWidth  = 680;   //キャンバスの幅
var canvasHeight = 510;   //キャンバスの高さ
var canvasBGColor = "#ffffff"; //キャンバスの背景色

//UndoManager
var undoManager;

//ツールボタン
var penBtn;
var brushBtn;
var rectBtn;
var eraserBtn;

//スライダー
var sliderForm;
var sliderBar;
var value = 0;

var sliderFormAlpha;
var sliderBarAlpha;
var valueAlpha;

//色選択
//赤
var sliderFormRed;
var sliderBarRed;
var valueRed;
//緑
var sliderFormGreen;
var sliderBarGreen;
var valueGreen;
//青
var sliderFormBlue;
var sliderBarBlue;
var valueBlue;


window.addEventListener("load", function(){
  
  penSize = document.getElementById("penSize");

  brushBtn = document.getElementById("brushBtn");
  eraserBtn = document.getElementById("eraserBtn");
  
  sliderForm = document.getElementById("slider_form_1");
  sliderBar = document.getElementById("slider_bar_1");
  sliderFormAlpha = document.getElementById("slider_form_alpha");
  sliderBarAlpha = document.getElementById("slider_bar_alpha");
    
  sliderFormRed = document.getElementById("slider_form_red");
  sliderBarRed = document.getElementById("slider_bar_red");
  sliderFormGreen = document.getElementById("slider_form_green");
  sliderBarGreen = document.getElementById("slider_bar_green");
  sliderFormBlue = document.getElementById("slider_form_blue");
  sliderBarBlue = document.getElementById("slider_bar_blue");
  
  layerBuffers = new Array(LAYER_DEPTH);
  
  createCanvas();

  tool = penTool;

  setEvent();  
}, true);

//イベント設定
//addEventListenerの第三引数 trueだと優先的にイベントを受け取る
function setEvent() {
  //レイヤキャンバスの作成
  for(var i=0; i<LAYER_DEPTH; i++){
    layerBuffers[i].canvasElement.addEventListener("touchstart", touchStartHandlerOnCanvas, true);
    layerBuffers[i].canvasElement.addEventListener("touchmove", touchMoveHandlerOnCanvas, true);
    layerBuffers[i].canvasElement.addEventListener("touchend", touchEndHandlerOnCanvas, true);
  }
//  canvas.addEventListener("touchcancel", touchEndHandler, true);
  document.addEventListener("touchstart", touchStartHandler, false);
  document.addEventListener("touchmove", touchMoveHandler, false);
  document.addEventListener("touchend", touchEndHandler, false);
//  document.addEventListener("touchcancel", touchCancelHandler, false);
//  document.addEventListener("gesturestart", gestureStartHandler, true);
  document.addEventListener("gesturechange", gestureMoveHandler, false);
//  document.addEventListener("gestureend", gestureEndHandler, true);
  window.addEventListener("devicemotion", handleOrientation, true);
  
  
  
  document.getElementById("newBtn").addEventListener("touchstart", clearCanvas, false);
  document.getElementById("undoBtn").addEventListener("touchstart", undo, true);
  document.getElementById("redoBtn").addEventListener("touchstart", redo, true);
  
  sliderBar.addEventListener("touchstart", touchStartHandlerOnSlider, true);
  sliderBar.addEventListener("touchmove", touchMoveHandlerOnSlider, true);
//  sliderForm.addEventListener("touchstart", touchStartOnSliderForm, false);

  document.getElementById("brushBtn").addEventListener("touchstart", touchStartHandlerOnBrushBtn, true);
  document.getElementById("penBtn").addEventListener("touchstart", touchStartHandlerOnPenBtn, true);
  document.getElementById("rectBtn").addEventListener("touchstart", touchStartHandlerOnRectBtn, true);
  document.getElementById("eraserBtn").addEventListener("touchstart", touchStartHandlerOnEraserBtn, true);

  document.getElementById("accBtn").addEventListener("touchstart", touchStartOnAccBtn, true);
}

/*
-------------------------------------------------------------------------
canvas以外のタッチイベント(Canvas上でも呼び出される)
-------------------------------------------------------------------------
*/
//指を置く度に呼び出される
function touchStartHandler(event) {  

  //描画色
  if(event.target == document.getElementById("drawColor")){
    if(!painter.isDrawColor){
      document.getElementById("drawColor").style.webkitBoxShadow = "none";
      document.getElementById("drawColor").style.marginTop = "10px";
      document.getElementById("changedColor").style.webkitBoxShadow = "0 5px 2px #9f9f9f";
      document.getElementById("changedColor").style.marginTop = "8px";
      sliderBarRed.innerHTML = painter.drawColor.red;
      sliderBarGreen.innerHTML = painter.drawColor.green;
      sliderBarBlue.innerHTML = painter.drawColor.blue;
      sliderBarRed.style.top = painter.drawColor.red + "px";
      sliderBarGreen.style.top = painter.drawColor.green + "px";
      sliderBarBlue.style.top = painter.drawColor.blue + "px";
      sliderBarAlpha.style.top = (1-painter.drawColor.alpha)*250 + "px";
      painter.isDrawColor = true;
    }
  }
  //グラデーション後の色
  if(event.target == document.getElementById("changedColor")){
    if(painter.isDrawColor){
      document.getElementById("changedColor").style.webkitBoxShadow = "none";
      document.getElementById("changedColor").style.marginTop = "10px";
      document.getElementById("drawColor").style.webkitBoxShadow = "0 5px 2px #9f9f9f";
      document.getElementById("drawColor").style.marginTop = "8px";
      sliderBarRed.innerHTML = painter.changedColor.red;
      sliderBarGreen.innerHTML = painter.changedColor.green;
      sliderBarBlue.innerHTML = painter.changedColor.blue;
      sliderBarRed.style.top = painter.changedColor.red + "px";
      sliderBarGreen.style.top = painter.changedColor.green + "px";
      sliderBarBlue.style.top = painter.changedColor.blue + "px";
      sliderBarAlpha.style.top = (1-painter.changedColor.alpha)*250 + "px";
      
      painter.isDrawColor = false;
    }
  }
}

//置いた指の座標が変わると呼び出される
function touchMoveHandler(event) {
  if(!event){
    event = window.event;
  }
  //縦スクロールを防ぐ
  event.preventDefault();
  
  for(var i=0; i<event.touches.length; i++){
    //カラースライダー  
    //赤  
    if(event.touches[i].target == sliderBarRed){
      var top = event.touches[i].pageY;
      
      var rect = sliderFormRed.getBoundingClientRect();
      valueRed = Math.round(top - rect.top);
      
      //はみだし防止
      if(valueRed < 0){
        valueRed = 0;
      }
      else if(valueRed > sliderFormRed.clientHeight - sliderBarRed.clientHeight){
        valueRed = sliderFormRed.clientHeight - sliderBarRed.clientHeight;
      }
      //スライダーの場所を指定
      sliderBarRed.style.top = valueRed + "px";
      
      painter.setColorRed(valueRed, painter.isDrawColor);
      setColor();
      sliderBarRed.innerHTML = valueRed;
    }
    
    //緑
    if(event.touches[i].target == sliderBarGreen){
      var top = event.touches[i].pageY;
      var rect = sliderFormGreen.getBoundingClientRect();
      valueGreen = Math.round(top - rect.top);
      
      //はみだし防止
      if(valueGreen < 0){
        valueGreen = 0;
      }
      else if(valueGreen > sliderFormGreen.clientHeight - sliderBarGreen.clientHeight){
        valueGreen = sliderFormGreen.clientHeight - sliderBarGreen.clientHeight;
      }
      //スライダーの場所を指定
      sliderBarGreen.style.top = valueGreen + "px";
      
      painter.setColorGreen(valueGreen, painter.isDrawColor);
      setColor();
      sliderBarGreen.innerHTML = valueGreen;
    }
    
    //青
    if(event.touches[i].target == sliderBarBlue){
      var top = event.touches[i].pageY;
      var rect = sliderFormBlue.getBoundingClientRect();
      valueBlue = Math.round(top - rect.top);
      
      //はみだし防止
      if(valueBlue < 0){
        valueBlue = 0;
      }
      else if(valueBlue > sliderFormBlue.clientHeight - sliderBarBlue.clientHeight){
        valueBlue = sliderFormBlue.clientHeight - sliderBarBlue.clientHeight;
      }
      //スライダーの場所を指定
      sliderBarBlue.style.top = valueBlue + "px";
      
      painter.setColorBlue(valueBlue, painter.isDrawColor);
      setColor();
      sliderBarBlue.innerHTML = valueBlue;
    }
    
    if(event.touches[i].target == sliderBarAlpha){
      var top = event.touches[i].pageY;
      var rect = sliderFormBlue.getBoundingClientRect();
      valueAlpha = Math.round(top - rect.top);
      
      if(valueAlpha < 0){
        valueAlpha = 0;
      }
      else if(valueAlpha > sliderFormAlpha.clientHeight - sliderBarAlpha.clientHeight){
        valueAlpha = sliderFormAlpha.clientHeight - sliderBarAlpha.clientHeight;
      }
      sliderBarAlpha.style.top = valueAlpha + "px";
     
      painter.setColorAlpha(1-valueAlpha/250, painter.isDrawColor);
      //sliderBarAlpha.innerHTML = valueAlpha; 1 - valueAlpha/250;
    }
  }
}

//置いた指を離すと呼び出される
function touchEndHandler(event) {
  
  if(event.target == document.getElementById("undoBtn")){
  }
  if(event.target == document.getElementById("redoBtn")){
  }
}

//ダイアログなどでタッチがキャンセルされると呼ばれる
function touchCancelHandler(event) {
}

/*
-------------------------------------------------------------------------
canvasのタッチイベント(Canvas以外では呼び出されない)
-------------------------------------------------------------------------
*/
//Canvas 指を置くごとに呼び出される
function touchStartHandlerOnCanvas( event ) {

  if( !drawing ){
    //加速度のリセット
    resetAccelerating();

    //描画中フラグを立てる
    drawing = true;
  }

  painter.ctx = layerBuffers[currentLayer].ctx;

  //描画座標を記録
  painter.setPrevPos(painter.dumpEvent(event, layerBuffers[currentLayer].canvasElement));
}

//Canvas 置いた指の座標が変わると呼び出される
function touchMoveHandlerOnCanvas( event ) { 
  if ( drawing ) {
    painter.setPos(painter.dumpEvent(event, layerBuffers[currentLayer].canvasElement));
      
    //描画
    tool.draw(painter);
    painter.setPrevPos(painter.pos);
  }  
}

//Canvas 指が離れると呼び出される
function touchEndHandlerOnCanvas( event ) {
  if ( event.touches.length == 0 ){
    drawing = false;
  }
  pushUndo();
}

/*
-------------------------------------------------------------------------
ジェスチャイベントのバインド(Canvas以外でも呼び出される //ToDo addEventListenerまだやってない)
-------------------------------------------------------------------------
*/
//2本目の指がタッチされたときに呼び出される(//ToDo 3本目以降はどうか)
function gestureStartHandler() {
}

//2本目以降もタッチしたまま動かすと呼び出される
function gestureMoveHandler(event) {
}

//指が一本になったら呼ばれる
function gestureEndHandler() {
}

/*
-------------------------------------------------------------------------
加速度操作
-------------------------------------------------------------------------
*/
function handleOrientation( event ) {
  var accData = event.accelerationIncludingGravity; //eventから加速度センサの数値を取り出す
  
  if ( accelerating ) {
    //描画位置に加速度を追加して取得
    //canvasの大きさを超えたらとめる
    if ( painter.pos.x < 0 ) {
      painter.pos.x = 0;
    }
    //canvasの大きさを超えたらとめる
    else if ( painter.pos.x > canvasWidth ) {
      painter.pos.x = canvasWidth;
    }
    else {
      painter.pos.x = painter.getPos().x + accData.y;
    }
    
    //canvasの大きさを超えたらとめる
    if ( painter.pos.y < 0 ) {
      painter.pos.y = 0;
    }
    //canvasの大きさを超えたらとめる
    else if ( painter.pos.y > canvasHeight ) {
      painter.pos.y = canvasHeight;
    }
    else {
      painter.pos.y = painter.getPos().y + accData.x;
    }
    
    tool.draw( painter );
    painter.setPrevPos( painter.pos );
  }
}

//点と点の距離
function distancePoints(x1, y1, x2, y2) {
  var x = Math.abs(x1-x2);
  var y = Math.abs(y1-y2);
  var dist = Math.sqrt(x*x + y*y);
  return dist;
}

//点と直線の距離(引数：直線を構成する2点(x1, y1), (x2, y2), 移動する点(x3, y3))
function distancePointAndLine(x1, y1, x2, y2, x3, y3) {
  var dist = Math.abs((y2-y1)*x3-(x2-x1)*y3-(y2-y1)*x1+(x2-x1)*y1)/Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
  return dist;
}

/*
-------------------------------------------------------------------------
Undo
-------------------------------------------------------------------------
*/
function undo() {
  var undoItem = undoManager.popUndo();
  if ( undoItem ) {
    pushRedo();
    ctx.putImageData(undoItem.data, undoItem.x, undoItem.y);
  }
}

function redo() {
  var undoItem = undoManager.popRedo();
  if ( undoItem ) {
    pushUndo(0, 0, canvasWidth, canvasHeight, true);
    ctx.putImageData(undoItem.data, undoItem.x, undoItem.y);
  }
}

function hasUndo() {
  return true;
}

function pushUndo(x, y, w, h, holdRedo) {
  x = (x==undefined)? 0 : x;
  y = (y==undefined)? 0 : y;
  w = (w==undefined)? canvasWidth : w;
  h = (h==undefined)? canvasHeight : h;
  var undoItem = new UndoItem();
  undoItem.x = 0;
  undoItem.y = 0;
  undoItem.width = w;
  undoItem.height = h;
  undoItem.data = ctx.getImageData(x, y, w, h);
  undoManager.pushUndo(undoItem, holdRedo);
}

function pushRedo(x, y, w, h) {
  x = (x==undefined)? 0 : x;
  y = (y==undefined)? 0 : y;
  w = (w==undefined)? canvasWidth : w;
  h = (h==undefined)? canvasHeight : h;
  var undoItem = new UndoItem();
  undoItem.x = 0;
  undoItem.y = 0;
  undoItem.width = w;
  undoItem.height = h;
  undoItem.data = ctx.getImageData(x, y, w, h);
  undoManager.pushRedo(undoItem);
}

function setColor() {
  document.getElementById("drawColor").style.backgroundColor = painter.getRGB(true);
  document.getElementById("changedColor").style.backgroundColor = painter.getRGB(false);
  document.getElementById("gradColor").style.background = "-webkit-gradient(linear, left top, right top, from("+painter.getRGB(true)+"), to("+painter.getRGB(false)+"))";
}

/*
-------------------------------------------------------------------------
描画補助
-------------------------------------------------------------------------
*/

//canvas生成
function createCanvas() {
  for(var i=0; i<LAYER_DEPTH; i++){
    layerBuffers[i] = new Canvas(canvasWidth, canvasHeight, "canvasArea");
    layerBuffers[i].canvasElement.style.zIndex = 90 - i * 2;
  }
  
  ctx = layerBuffers[currentLayer].ctx;
  
  //UndoManagerの生成
  undoManager = new UndoManager(MAX_STEP);
  painter.ctx = layerBuffers[currentLayer].ctx;
  //白紙の保存
  pushUndo();
}

//canvasのクリア
function clearCanvas(doConfirm) {
  if(!doConfirm || window.confirm("消去してもよろしいですか？")){
    pushUndo();
  
    //加速度のリセット
    resetAccelerating();
    
    drawing = false;

    ctx.fillStyle = canvasBGColor;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }
} 

//線描画
function drawLine(ctx, x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

//四角描画
function drawRect(ctx, x, y, w, h, isStroke, isFill) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x+w, y);
  ctx.lineTo(x+w, y+h);
  ctx.lineTo(x, y+h);
  ctx.closePath();
  
  if(isFill){
    ctx.fill();
  }
  if(isStroke){
    ctx.stroke();
  }
}

//丸描画
function drawArc(ctx, x, y) {
  var r = lineSize/2; //フォントサイズの半分
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, false);
  ctx.fill();
}

/*
-------------------------------------------------------------------------
スライダー
-------------------------------------------------------------------------
*/
function touchStartHandlerOnSlider(event) {    
  return false;
}

function touchMoveHandlerOnSlider(event) {
  if(!event){
    event = window.event;
  }
  for(var i=0; i<event.touches.length; i++){
    if(event.touches[i].target == sliderBar){
      var top = event.touches[i].pageY;
    }
  }
  var rect = sliderForm.getBoundingClientRect();
  value = Math.round(top - rect.top);

  //はみだし防止
  if(value < 0){
    value = 0;
  }
  else if(value > sliderForm.clientHeight - sliderBar.clientHeight){
    value = sliderForm.clientHeight - sliderBar.clientHeight;
  }
  setValue();
  return false;
}

function touchEndHandlerOnSlider(event) {
}

function setValue() {
  //スライダーの場所を指定
  sliderBar.style.top = value + "px";
  
  if(value/4 < 5){
    painter.penSize = 5;
  }
  else if(value/4 > 75){
    painter.penSize = 75;
  }
  else {
    painter.penSize = value / 4;
  }
  penSize.style.fontSize = painter.penSize * 2 + "px";
}

function touchStartOnSliderForm(event) {
  for(var i=0; i<event.touches.length; i++){
    if(event.touches[i].target == sliderForm){
      var top = event.touches[i].pageY;
    }
  }
  var rect = sliderForm.getBoundingClientRect();
  value = Math.round(top - rect.top);

  //はみだし防止
  if(value < 0){
    value = 0;
  }
  else if(value > sliderForm.clientHeight - sliderBar.clientHeight){
    value = sliderForm.clientHeight - sliderBar.clientHeight;
  }
  setValue();
  return false;
}

/*
-------------------------------------------------------------------------
ツールボタン
-------------------------------------------------------------------------
*/
function touchStartHandlerOnPenBtn(event) {
  tool = penTool;
  
  $( '#penBtn' ).css( 'background', '-webkit-linear-gradient( top, #b0b0b0, #f0f0f0 )' );
  $( '#brushBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#rectBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#eraserBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  document.getElementById("penSize").innerHTML = "●";
}

function touchStartHandlerOnBrushBtn(event) {
  tool = brushTool;
  
  $( '#penBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#brushBtn' ).css( 'background', '-webkit-linear-gradient( top, #b0b0b0, #f0f0f0 )' );
  $( '#rectBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#eraserBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  
  document.getElementById("penSize").innerHTML = "●";
}

function touchStartHandlerOnRectBtn(event) {
  tool = rectTool;
  
  $( '#penBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#brushBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#rectBtn' ).css( 'background', '-webkit-linear-gradient( top, #b0b0b0, #f0f0f0 )' );
  $( '#eraserBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  
  document.getElementById("penSize").innerHTML = "■";
}

function touchStartHandlerOnEraserBtn(event) {
  tool = eraserTool;
  
  $( '#penBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#brushBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#rectBtn' ).css( 'background', '-webkit-linear-gradient( top, #f0f0f0, #b0b0b0 )' );
  $( '#eraserBtn' ).css( 'background', '-webkit-linear-gradient( top, #b0b0b0, #f0f0f0 )' );
  
  document.getElementById("penSize").innerHTML = "●";
}

function touchStartOnAccBtn() {
  if ( !accelerating ) {
    jQuery( '#accBtn' ).css( 'margin-left', '50px' );
    jQuery( '#accBtn' ).css( '-webkit-box-shadow', '-2px 0 2px #000' );
  
    accelerating = true;
    pushUndo();
    
  }else if ( accelerating ){
    resetAccelerating();
    pushUndo();
  }
}

function resetAccelerating() {
  jQuery( '#accBtn' ).css( 'margin-left', '0' );
  jQuery( '#accBtn' ).css( '-webkit-box-shadow', '2px 0 2px #000' );  
  accelerating = false;
}
