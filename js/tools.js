/*
-------------------------------------------------------------------------
Pen Tool
-------------------------------------------------------------------------
*/
var PenTool = function() {
};

PenTool.prototype = {
  draw: function( painter ) {
    painter.ctx.strokeStyle = painter.getRGBA( painter.isDrawColor );
    painter.ctx.lineWidth = painter.penSize;
    
    painter.ctx.lineJoin = "round";
    painter.ctx.lineCap = "round";
    
    painter.ctx.beginPath();
    painter.ctx.moveTo( painter.pos.x, painter.pos.y );
    painter.ctx.lineTo( painter.prevPos.x, painter.prevPos.y );
    painter.ctx.stroke();
    
  }
};

/*
-------------------------------------------------------------------------
Brush Tool
-------------------------------------------------------------------------
*/
var BrushTool = function() {
};

BrushTool.prototype = {
  draw: function(painter) {
    painter.ctx.beginPath();
    var circleGrad = painter.ctx.createRadialGradient(painter.pos.x, painter.pos.y, 0, painter.pos.x, painter.pos.y, painter.penSize);
    circleGrad.addColorStop(0, painter.getRGBA(painter.isDrawColor));
    circleGrad.addColorStop(1, "rgba("+ painter.getColorRed(painter.isDrawColor) + "," + painter.getColorGreen(painter.isDrawColor) + ","
                                      + painter.getColorBlue(painter.isDrawColor) + ", 0)");
    painter.ctx.fillStyle = circleGrad;
    painter.ctx.arc(painter.pos.x, painter.pos.y, painter.penSize, 0, Math.PI*2, false);
    painter.ctx.fill();
  }
};

/*
-------------------------------------------------------------------------
Rect Tool
-------------------------------------------------------------------------
*/
var RectTool = function() {
};

RectTool.prototype = {
  draw: function(painter) {     
    var rectGrad = painter.ctx.createLinearGradient(
                     painter.pos.x-painter.penSize, painter.pos.y-painter.penSize, painter.pos.x+painter.penSize, painter.pos.y+painter.penSize);
    rectGrad.addColorStop(0, painter.getRGBA(true));
    rectGrad.addColorStop(1, painter.getRGBA(false));
    painter.ctx.fillStyle = rectGrad;
    this.drawRect(painter.ctx, painter.pos.x-painter.penSize, painter.pos.y-painter.penSize, painter.penSize, painter.penSize, false, true);
    this.drawRect(painter.ctx, painter.pos.x-painter.penSize, painter.pos.y, painter.penSize, painter.penSize, false, true);
    this.drawRect(painter.ctx, painter.pos.x, painter.pos.y, painter.penSize, painter.penSize, false, true);
    this.drawRect(painter.ctx, painter.pos.x, painter.pos.y-painter.penSize, painter.penSize, painter.penSize, false, true);
  },
  
  drawRect: function(ctx, x, y, w, h, isStroke, isFill) {
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
};

/*
-------------------------------------------------------------------------
Eraser Tool
-------------------------------------------------------------------------
*/
var EraserTool = function() {
};

EraserTool.prototype = {
  draw: function(painter) {
    painter.ctx.save();

    painter.ctx.strokeStyle = painter.getRGBA(painter.isDrawColor);
    painter.ctx.lineWidth = painter.penSize;
    painter.ctx.globalCompositeOperation = "destination-out";
    painter.ctx.lineJoin = "round";
    painter.ctx.lineCap = "round";
    
    painter.ctx.beginPath();
    painter.ctx.moveTo(painter.pos.x, painter.pos.y);
    painter.ctx.lineTo(painter.prevPos.x, painter.prevPos.y);
    painter.ctx.stroke();
    
    painter.ctx.restore();
  }
};
