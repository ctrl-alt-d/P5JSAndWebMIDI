var systems = [];
var fromNota = 48;
var toNota = 100;
var notesSonant = [];

function setup() {
    createCanvas( windowWidth, windowHeight);
    systems = [];

    for (let i = fromNota; i<=toNota; i++ ) {
        let ampladaNota = windowWidth/ ( toNota-fromNota+1) ;
        let p = new ParticleSystem(createVector((i-fromNota)*ampladaNota+ampladaNota/2, 50));
        systems[i] = p;
    }

    let r = navigator.requestMIDIAccess();
    r.then( midi => midi.inputs.forEach( (x)=> x.onmidimessage = arribaNota ) );
}

function arribaNota( n ) {
    if (n.data[2]==0) {
        notesSonant = notesSonant.filter(x=>x!=n.data[1]);
    } else {
        notesSonant.push(n.data[1]);
    }
    //console.log('notesSonant :', notesSonant);
}

/* ---- */

function draw() {
    background(0);
    for (i = fromNota; i <= toNota; i++) {
      systems[i].run();
      if (notesSonant.includes(i)) {
        systems[i].addParticle();
      }
      
    }
  }
  
  
  // A simple Particle class
  var Particle = function(position) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255.0;
  };
  
  Particle.prototype.run = function() {
    this.update();
    this.display();
  };
  
  // Method to update position
  Particle.prototype.update = function(){
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  };
  
  // Method to display
  Particle.prototype.display = function () {
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 20, 20);
  };
  
  // Is the particle still useful?
  Particle.prototype.isDead = function () {
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  };
  
  var ParticleSystem = function (position) {
    this.origin = position.copy();
    this.particles = [];
  };
  
  ParticleSystem.prototype.addParticle = function () {
    // Add either a Particle or CrazyParticle to the system
    if (int(random(0, 2)) == 0) {
      p = new Particle(this.origin);
    }
    else {
      p = new CrazyParticle(this.origin);
    }
    this.particles.push(p);
  };
  
  ParticleSystem.prototype.run = function () {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  };
  
  // A subclass of Particle
  
  function CrazyParticle(origin) {
    // Call the parent constructor, making sure (using Function#call)
    // that "this" is set correctly during the call
    Particle.call(this, origin);
  
    // Initialize our added properties
    this.theta = 0.0;
  };
  
  // Create a Crazy.prototype object that inherits from Particle.prototype.
  // Note: A common error here is to use "new Particle()" to create the
  // Crazy.prototype. That's incorrect for several reasons, not least 
  // that we don't have anything to give Particle for the "origin" 
  // argument. The correct place to call Particle is above, where we call 
  // it from Crazy.
  CrazyParticle.prototype = Object.create(Particle.prototype); // See note below
  
  // Set the "constructor" property to refer to CrazyParticle
  CrazyParticle.prototype.constructor = CrazyParticle;
  
  // Notice we don't have the method run() here; it is inherited from Particle
  
  // This update() method overrides the parent class update() method
  CrazyParticle.prototype.update=function() {
    Particle.prototype.update.call(this);
    // Increment rotation based on horizontal velocity
    this.theta += (this.velocity.x * this.velocity.mag()) / 10.0;
  }
  
  // This display() method overrides the parent class display() method
  CrazyParticle.prototype.display=function() {
    // Render the ellipse just like in a regular particle
    Particle.prototype.display.call(this);
    // Then add a rotating line
    push();
    translate(this.position.x, this.position.y);
    rotate(this.theta);
    stroke(255,this.lifespan);
    line(0,0,25,0);
    pop();
  }