// main variable declarations
w = 1100;
h = 700;

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
graphics.drawCircle(1, 1, 3);
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
    var totalParticles = 100;
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
            var a = calcDerivs(this.x, this.y, this.vx, this.vy, this.ax, this.ay, t, 0, Fx, Fy, D, gamma, gravity);
            var b = calcDerivs(this.x, this.y, a[0][0], a[0][1], a[1][0], a[1][1], t, 0.5*dt, Fx, Fy, D, gamma, gravity);
            var c = calcDerivs(this.x, this.y, b[0][0], b[0][1], b[1][0], b[1][1], t, 0.5*dt, Fx, Fy, D, gamma, gravity);
            var d = calcDerivs(this.x, this.y, c[0][0], c[0][1], c[1][0], c[1][1], t, dt, Fx, Fy, D, gamma, gravity);

            var dxdt = (a[0][0]+2*(b[0][0]+c[0][0])+d[0][0])/6;
            var dydt = (a[0][1]+2*(b[0][1]+c[0][1])+d[0][1])/6;
            var dvxdt = (a[1][0]+2*(b[1][0]+c[1][0])+d[1][0])/6;
            var dvydt = (a[1][1]+2*(b[1][1]+c[1][1])+d[1][1])/6;

            this.x += dxdt*dt;
            this.y += dydt*dt;
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
    var k = 0  ;


    return [-k*(x-w/2)-gamma*vx+Fx+D*z.nextGaussian(),-k*(y-h/2)-gamma*vy+Fy+D*(z.nextGaussian())+  gravity];
};


var time = 0;
var count = 0;
var dt = 1/500;
var D =0;
var gamma = 10000;
var normF = [0,0];
var minDistance = 1;
var gravity = 0;

requestAnimationFrame(animate);

function animate() {

    stats.begin();

    // updating the slider parameters only now and then to avoid loss of performance
    if(count % 20 == 0) {
        D = $('#Dslider').slider('value') *100;
        normF[0] = $('#LJAslider').slider('value')*1000000;
        normF[1] = $('#LJBslider').slider('value');
        gamma = $('#Gslider').slider('value');
        gravity = $('#Gravslider').slider('value')*1000;

    }


    for (var i = 0; i < totalParticles; i++) {

        var Fx = 0;
        var Fy = 0;
        var deltaX = 0;
        var deltaY = 0;

            particles[i].BCs();
            // the LJ interaction happens only when it exists.
            // if F = 0 it speeds up the calculations a lot!
            if(normF != 0) {
                for(var j = 0; j < totalParticles; j++) {

                    if(i != j) {
                        deltaX = particles[i].x - particles[j].x;
                        deltaY = particles[i].y - particles[j].y;
                        var normR = Math.sqrt(deltaX*deltaX + deltaY*deltaY);

                        // correcting for overlap
                        if(normR < minDistance) {
                            particles[i].x += deltaX * (minDistance - normR)/normR;
                            particles[i].y += deltaY * (minDistance - normR)/normR;

                            normR = minDistance;
                            deltaX = particles[i].x - particles[j].x;
                            deltaY = particles[i].y - particles[j].y;
                        }

                        Fx += normF[0]*(6*Math.pow(normF[1]/normR,6)/normR-12*Math.pow(normF[1]/normR,12)/normR) * (deltaX/normR);
                        Fy += normF[0]*(6*Math.pow(normF[1]/normR,6)/normR-12*Math.pow(normF[1]/normR,12)/normR) * (deltaY/normR);
                    } else {
                        Fx += 0;
                        Fy += 0;
                    }

                }
            }

        particles[i].integrate(1, dt, Fx, Fy, D, gamma, gravity);

    }
    // blurFilter1.blur = 5;
    count += 1;
    time = dt * count;
    renderer.render(stage);
    stats.end();

    requestAnimationFrame(animate);

}
