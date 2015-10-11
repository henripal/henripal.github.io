var x1 = 100;
var y1 = 150;
var dx1 = 1;
var dy1 = 1;

var x2 = 150;
var y2 = 100;
var dx2 = -1;
var dy2 = -1;

var x3 = 90;
var y3 = 100;
var dx3 = 1;
var dy3 = -1;
var canvasMinY;
var canvasMinX;
var canvasMaxX;
var canvasMaxY;

var randFact = 1;

var Width;
var Height;
var ctx;
var color;
var temp;

//get a reference to the canvas
function init() {
 ctx = $('#canvas')[0].getContext("2d");
    Width = $('#canvas').width();
    Height = $('#canvas').height();
    return setInterval(draw,10);
}

function init_mouse() {
canvasMinX = $("#canvas").offset().left;
    canvasMinY = $("#canvas").offset().top;
    canvasMaxX = canvasMinX + Width;
    canvasMaxY = canvasMinY + Height;
}

function onMouseMove(evt) {
   if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
    x3=evt.pageX - canvasMinX;
  }
	if (evt.pageY > canvasMinY && evt.pageY < canvasMaxY) {
    y3 = evt.pageY - canvasMinY;
  }
}

//draw a circle
function ircle(x,y,r,color) {
	ctx.fillStyle=color;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

//draw a circle
function rect(x,y,w,h) {
	ctx.fillStyle="rgba(200,200,50,.7)";
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	ctx.closePath();
	ctx.fill();
}

function clear() {
	ctx.clearRect(0,0,Width,Height);
}

function getRand() {
	if  (Math.random() >= 0.5) {return 1;	}
		else { return -1;}
}

$(document).mousemove(onMouseMove);

function draw() {
	clear();
	circle(x2,y2,10,"rgba(200,200,200,0.7)");
	circle(x1,y1,10,"rgba(000,200,200,0.7)");
	circle(x3,y3,10,"rgba(200,000,200,0.7)");

	if (x1 + dx1 > Width || x1 + dx1 < 0)
    dx1 = -dx1;
  if (y1 + dy1 >  Height || y1 + dy1 < 0)
    dy1 = -dy1;
	if (x2 + dx2 > Width || x2 + dx2 < 0)
    dx2 = -dx2;
  if (y2 + dy2 > Height || y2 + dy2 < 0)
    dy2  = -dy2;

	if (Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)) < 20) {
		temp=dx1;
		dx1=dx2;
		dx2=temp;
		temp=dy1;
		dy1=dy2;
		dy2=temp;
	}
	if (Math.sqrt((x3-x1)*(x3-x1) + (y3-y1)*(y3-y1)) < 20) {
		temp=dx1;
dx1=dx3;
		dx3=temp;
		temp=dy1;
		 dy1=dy3;
		dy3=temp;
	}
	if (Math.sqrt((x3-x2)*(x3-x2) +(y3-y2)*(y3-y2)) < 20) {
		temp=dx2;
		dx2=dx3;
		dx3=temp;
		temp=dy2;
		dy2=dy3;
		dy3=temp;
	}

	x1 += dx1;
	y1 += dy1;
	x2 += dx2;
	y2 += dy2;

}

init();
init_mouse();
