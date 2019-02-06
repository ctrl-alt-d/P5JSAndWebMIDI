let notes=[];
let angle=0;
let negres=[1,3,6,8,10];
let started=false;

function setup()
{
    inicialitzaWebMidi();
    createCanvas(windowWidth, windowHeight);
    windowResized();
    background(255);
    angleMode(DEGREES);
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

function draw()
{
    angle += started?0.09:0;
    
    push();
    translate(windowWidth/2,windowHeight/2);
    rotate(angle);
    
    //esborrar
    let c=color(255,10);
    fill(c);
    noStroke();
    let w = Math.min(windowWidth,windowHeight);
    arc(0, 0, w, w, 0-85, 5-85,PIE);

    //notes
    stroke(0,0,0,120);
    notes.forEach(x =>
    {
        nota = x[0]; atac = x[1];
        let alcada = map(nota, 0, 100 , 0, Math.min(windowWidth,windowHeight)/2 ) - 20;
        let amplada = map(atac, 0 , 100 ,0, Math.min(windowWidth,windowHeight)/(40) );
        if (negres.includes(nota%12)) { strokeWeight(3);} else {strokeWeight(1);}        
        ellipse(0,-alcada,amplada,amplada);
    });
    notes = [];
    pop();
}


/* ---- */

function noteOn( nota, atac ) {

    //console.log("arriba nota", -alcada);
    started=true;
    notes.push( [nota,atac] );
}

function noteOff( nota ) {
    //console.log("finalitza nota", nota);
}

/* ---- */

async function inicialitzaWebMidi() {

    try {
        //demano accés
        let midi = await navigator.requestMIDIAccess();
        console.log("ja tinc l'objecte midi:", midi);

        //quan m'arribin msgs pels ports midi cridar funció delegada
        midi.inputs.forEach( port => port.onmidimessage = quanArribaUnMissatgeMidi );

        //si em punxen o em despunxen dispositius
        midi.onstatechange = quanCanviiEstatPortMidi;

    } catch(err) {

        //error durant la inicialització del midi
        console.error(err);
    }

}

function quanArribaUnMissatgeMidi( missatge ) {
    
    if (missatge.data[0] == 144 ) {
        if (missatge.data[2] != 0 ) {
            noteOn( missatge.data[1], missatge.data[2] );
        }
        else{
            //instruments que envien noteon a velocitat 0
            noteOff( missatge.data[1] );
        }        
    } else if (missatge.data[0] == 128) {
        noteOff( missatge.data[1] );
    } else {
        console.log("m'arriba missatge", missatge);
    }

}

function quanCanviiEstatPortMidi( canvi ) {
    console.log("canvi estat port", canvi);
    canvi.port.onmidimessage = quanArribaUnMissatgeMidi;
}

