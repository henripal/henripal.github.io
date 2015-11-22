// main variable declarations
w = 600;
h = 400;
var PxPerUnit = w/50;

// FPS show
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
document.getElementById('fps').appendChild( stats.domElement );



// ***************
// PIXI overhead *
// ***************

// renderer autodetection
var renderer = PIXI.autoDetectRenderer(w, h, { backgroundColor: 0x000000, antialias: true });
document.body.appendChild(renderer.view);

// stage creation
var stage = new PIXI.Container();

// generating the particle container
var sprites = new PIXI.ParticleContainer(alpha = false); // option ParticleContainer or Container
stage.addChild(sprites);
sprites.alpha= 0.7;

// generating the aspect of our particles
var graphics = new PIXI.Graphics(alpha= false); //option alpha = true
graphics.beginFill(0xffffff);
graphics.drawCircle(1, 1, PxPerUnit/2);
graphics.endFill();

// optional blur filter
//var blurFilter1 = new PIXI.filters.BlurFilter();
//sprites.filters=[blurFilter1];


//*************************
//** RK helper Functions **
//*************************


// calculates the derivatives of the variables for the RK algorithm
// calls the acceleration
calcDerivs = function(x, y, vx, vy, ax, ay, t, dt, Fx, Fy, D, gamma, gravity) {
        var newX = x + vx*dt;
        var newY = y + vy*dt;
        var newVx = vx + ax*dt;
        var newVy = vy + ay*dt;

        return [[newVx, newVy], acceleration(newX, newY, newVx, newVy, t+ dt, Fx, Fy, D, gamma, gravity) ];
};




// ********************
// PARTICLE CREATION **
// ********************

//total number of particles depends on the renderer
if(renderer instanceof PIXI.CanvasRenderer) {
    //canvas renderer
    var totalParticles = 100;
} else {
    //webGL renderer
    var totalParticles = 200;
}

var particles = [];
var j = 0;

// initalize the particles
for (var i = 0; i < totalParticles; i++) {
        var dude = new PIXI.Sprite(graphics.generateTexture());
        dude.vx = 0;
        dude.vy = 0;
        dude.ax = 0;
        dude.ay = 0;

        var pad = 10;

        //stupid algorithm to avoid inital blowup
        var CharLength = Math.sqrt((w-2*pad)*(h-2*pad)/totalParticles);
        var j;

        if(pad + i*CharLength - j*w >= w ) { j++;}

        dude.x = pad + (i)*CharLength - j*w;
        dude.y = pad + j*CharLength;



        // main RK integrator
        dude.integrate = function(t, dt, Fx, Fy, D, gamma, gravity) {
            var a = calcDerivs(this.x/PxPerUnit, this.y/PxPerUnit, this.vx, this.vy, this.ax, this.ay, t, 0, Fx, Fy, D, gamma, gravity);
            var b = calcDerivs(this.x/PxPerUnit, this.y/PxPerUnit, a[0][0], a[0][1], a[1][0], a[1][1], t, 0.5*dt, Fx, Fy, D, gamma, gravity);
            var c = calcDerivs(this.x/PxPerUnit, this.y/PxPerUnit, b[0][0], b[0][1], b[1][0], b[1][1], t, 0.5*dt, Fx, Fy, D, gamma, gravity);
            var d = calcDerivs(this.x/PxPerUnit, this.y/PxPerUnit, c[0][0], c[0][1], c[1][0], c[1][1], t, dt, Fx, Fy, D, gamma, gravity);

            var dxdt = (a[0][0]+2*(b[0][0]+c[0][0])+d[0][0])/6;
            var dydt = (a[0][1]+2*(b[0][1]+c[0][1])+d[0][1])/6;
            var dvxdt = (a[1][0]+2*(b[1][0]+c[1][0])+d[1][0])/6;
            var dvydt = (a[1][1]+2*(b[1][1]+c[1][1])+d[1][1])/6;

            this.x += dxdt*dt * PxPerUnit;
            this.y += dydt*dt * PxPerUnit;
            this.vx += dvxdt*dt;
            this.vy += dvydt*dt;
        };

        // define boundary conditions
        dude.BCs = function(){
            if(this.x > w) {
                this.x = w;
                this.vx = -this.vx;
            }
            if(this.x < 0) {
                this.x = 0;
                this.vx = -this.vx;
            }
            if(this.y > h) {
                this.y = h;
                this.vy = -this.vy;
            }
            if(this.y < 0) {
                this.y = 0;
                this.vy = -this.vy;
            }
        };

        particles.push(dude);
        sprites.addChild(dude);

}



// ********************
// ** ANIMATION STEP **
// ********************
var z = new Ziggurat(); //initialize our normal RNG


// this is the main driver for the forces!
var acceleration = function(x, y, vx, vy, t, Fx, Fy, D, gamma, gravity) {
    var k = 10000;
    var WallPad = 0.5;
    var WallFx =0;
    var WallFy =0;

    if( x < 0*WallPad ) {
            WallFx = -(x-0*WallPad) * k;
    } else {
        if(x > w/PxPerUnit-2*WallPad) {WallFx = (w/PxPerUnit-2*WallPad-x)* k;}
    }

    if( y < 0*WallPad ) {
            WallFy = -(y-0*WallPad) * k;
    } else {
        if(y > h/PxPerUnit-2*WallPad) {WallFy = (h/PxPerUnit-2*WallPad-y)* k;}
    }

    return [-gamma*vx+Fx+D*z.nextGaussian()+WallFx,-gamma*vy+Fy+D*(z.nextGaussian())+ gravity+WallFy];
};


var time = 0;
var count = 0;
var dt = 1/6000;
var D = 0;
var gamma = 10000;
var normF = [0,0];
var minDistance =0;
var gravity = 0;
var frameNumbers = 6;
var cutOff = 3*3;

requestAnimationFrame(animate);

function updateParams() {
    D = $('#Dslider').slider('value');
    normF[0] = $('#LJAslider').slider('value');
    normF[1] = $('#LJBslider').slider('value');
    gamma = $('#Gslider').slider('value');
    gravity = $('#Gravslider').slider('value')*10;
}

function animate() {

    stats.begin();

    // looping before showing:
    for(var l=0; l<frameNumbers; l++) {

        var Fx=Array.apply(null, new Array(totalParticles)).map(Number.prototype.valueOf,0);
        var Fy=Array.apply(null, new Array(totalParticles)).map(Number.prototype.valueOf,0);
        // var normR2, normR2m1, deltaX, deltaY, attract, repel;

        //computing Lennard Jones Forces
        if(normF[1]>0.01) {
            for(var i = 0; i < totalParticles; i++) {
                for(var j = 0; j < i; j++) {

                    deltaX = particles[i].x/PxPerUnit - particles[j].x/PxPerUnit;
                    deltaY = particles[i].y/PxPerUnit - particles[j].y/PxPerUnit;
                    normR2 = deltaX*deltaX + deltaY*deltaY;
                    if(normR2 < cutOff) {
                        normR2m1 = normF[0]/normR2;
                        attract = normR2m1 * normR2m1 * normR2m1;
                        repel = attract * attract;
                        Fx[i] += 2*normF[1]*(2*repel-attract) * (deltaX*normR2m1);
                        Fy[i] += 2*normF[1]*(2*repel-attract) * (deltaY*normR2m1);
                        Fx[j] -= 2*normF[1]*(2*repel-attract) * (deltaX*normR2m1);
                        Fy[j] -= 2*normF[1]*(2*repel-attract) * (deltaY*normR2m1);
                    }
                }
            }
        }

                //
                // if(i != j) {
                //     deltaX = particles[i].x - particles[j].x;
                //     deltaY = particles[i].y - particles[j].y;
                //     var normR = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
                //
                //     // correcting for overlap
                //     if(normR < minDistance) {
                //         particles[i].x += deltaX * (minDistance - normR)/normR;
                //         particles[i].y += deltaY * (minDistance - normR)/normR;
                //
                //         normR = minDistance;
                //         deltaX = particles[i].x - particles[j].x;
                //         deltaY = particles[i].y - particles[j].y;
                //     }




        for (var k = 0; k < totalParticles; k++) {
            particles[k].integrate(1, dt, Fx[k], Fy[k], D, gamma, gravity);
            // particles[k].BCs();
        }

        // blurFilter1.blur = 5;
        count += 1;
        time = dt * count;
    }
    renderer.render(stage);
    stats.end();

    requestAnimationFrame(animate);

}
