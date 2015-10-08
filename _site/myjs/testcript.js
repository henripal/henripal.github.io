
var newtonG = 6.67e-11;        // grav. constant in SI units
var earthMass = 5.97e24;       // kilograms
var dt = 5;                    // time step in seconds
var r = Math.sqrt(x*x + y*y);
var accel = newtonG * earthMass / (r * r);  // magnitude of a
var earthRadius = 6371000;   // meters
var mountainHeight = earthRadius * 0.165;  // chosen to match image
var x = 0;
var y = earthRadius + mountainHeight;
var ax = -accel * x / r;
var ay = -accel * y / r;
var vx = 6000;   // meters per second
var vy = 0;
var theCanvas = document.getElementById("theCanvas");
var theContext = theCanvas.getContext("2d");



function drawProjectile() {
	theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
	var metersPerPixel = earthRadius / (0.355 * theCanvas.width);
	var pixelX = theCanvas.width/2 + x/metersPerPixel;
  var pixelY = theCanvas.height/2 - y/metersPerPixel;
	theContext.beginPath();
	theContext.arc(pixelX, pixelY, 5, 0, 2*Math.PI);
	theContext.fillStyle = "red";
	theContext.fill();
	theContext.arc(theCanvas.width/2, theCanvas.height/2, earthRadius/metersPerPixel, 0, 2*Math.PI);
	theContext.fillStyle = "blue";
	theContext.fill();

}

function moveProjectile() {
	x += 1;
	r = Math.sqrt(x*x + y*y);
	if (r > earthRadius) {
		accel = newtonG * earthMass / (r * r);
		ax = -accel * x / r;
		ay = -accel * y / r;
		lastx = x;
		vx += ax * dt;
		vy += ay * dt;
		x += vx * dt;
		y += vy * dt;
		drawProjectile();
	}
	window.setTimeout(moveProjectile, 1000/30);
}

moveProjectile();
