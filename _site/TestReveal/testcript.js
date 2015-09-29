var x = 300;
var y = 50;
var newtonG = 6.67e-11;        // grav. constant in SI units
var earthMass = 5.97e24;       // kilograms
var dt = 5;                    // time step in seconds
var r = Math.sqrt(x*x + y*y);
var accel = newtonG * earthMass / (r * r);  // magnitude of a

var theCanvas = document.getElementById("theCanvas");
var theContext = theCanvas.getContext("2d");
function drawProjectile() {
	theContext.clearRect(0, 0, theCanvas.width, theCanvas.height);
    theContext.beginPath();
    theContext.arc(x, y, 5, 0, 2*Math.PI);
    theContext.fillStyle = "red";
    theContext.fill();
}
function moveProjectile() {
    x += 1;
    drawProjectile();
    window.setTimeout(moveProjectile, 1000/30);
}
moveProjectile();