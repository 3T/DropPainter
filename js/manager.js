/*
-------------------------------------------------------------------------
Undo or Redo Manager
-------------------------------------------------------------------------
*/
var UndoManager = function(maxStep) {
  this.maxStep = maxStep;
  this.undoItems = [];
  this.redoItems = [];
}
UndoManager.prototype.maxStep;
UndoManager.prototype.redoItems;
UndoManager.prototype.undoItems;

UndoManager.prototype.pushUndo = function(undoItem, holdRedo) {
  this.undoItems.push(undoItem);
  if(this.undoItems.length > this.maxStep){
    this.undoItems.shift();
  }
  
  if(!holdRedo==true){
    this.redoItems = [];
  }
};

UndoManager.prototype.popUndo = function() {
  return this.undoItems.pop();
};

UndoManager.prototype.pushRedo = function(undoItem) {
  this.redoItems.push(undoItem);
};

UndoManager.prototype.popRedo = function() {
  return this.redoItems.pop();
};

var UndoItem = function(){}
UndoItem.prototype.data;
UndoItem.prototype.x;
UndoItem.prototype.y;
UndoItem.prototype.width;
UndoItem.prototype.height;
