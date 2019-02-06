let notes = ["C","C#","D","D#","E","F","F#","G","G#","A","#A","B" ];
let sostinguts = notes.map( x => x.indexOf("#") != -1 );
let notesQueEstanSonant = [];

function setup() {
    inicialitzaWebMidi();
    createCanvas(windowWidth, windowHeight);
    background(51);
    pintaPiano( );
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    pintaPiano();
}

function draw() {
    pintaPiano();
}

function pintaPiano( desde=21, finsa=108)
{
    background(51);

    //pinta blanques
    strokeWeight(1);
    stroke(0);
    
    let numBlanques = 0;
    for (let i = desde; i<=finsa; i++ ) {
        if (!sostinguts[i%12]) {
            numBlanques += 1;
        }
    }
    let ampladaBlanca = windowWidth/numBlanques;
    let alcadaBlanca = Math.min(  (1/3)*windowHeight, ampladaBlanca*6 ); 
    let posicio = 0;
    for (let i = desde; i<=finsa; i++) {
        if (!sostinguts[i%12]) {
            if (notesQueEstanSonant.includes(i)) {
                fill(0,0,255);
            } else {
                fill(255);
            }
            rect( posicio*ampladaBlanca, windowHeight-alcadaBlanca , ampladaBlanca, alcadaBlanca  );
            posicio += 1;
        }
    }

    //pinta negres
    let ampladaNegra = (4/5)*ampladaBlanca;
    let alcadaNegra = (2/3)*alcadaBlanca;
    posicio = 0;
    for (let i = desde; i<=finsa; i++) {
        if (sostinguts[i%12]) {
            if (notesQueEstanSonant.includes(i)) {
                fill(0,0,255);
            } else {
                fill(0);
            }
            rect(  posicio*ampladaBlanca-0.5*ampladaBlanca, 
                   windowHeight-alcadaBlanca,
                   ampladaNegra,
                   alcadaNegra
                    );
        } else {
            posicio += 1;
        }
    }
}


/* --- quan arribi una nota la pinto en un lloc random -- */

function noteOn( nota, atac ) {
    notesQueEstanSonant.push(nota);
}

function noteOff( nota ) {
    notesQueEstanSonant = notesQueEstanSonant.filter(x=>x!=nota);
}

/* ---- inicialització del web midi ---- */

async function inicialitzaWebMidi() {

    try {
        //demano accés
        let midi = await navigator.requestMIDIAccess();

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
        //console.log("m'arriba missatge", missatge);
    }

}

function quanCanviiEstatPortMidi( canvi ) {
    console.log('object :', canvi);
    canvi.port.onmidimessage = quanArribaUnMissatgeMidi;
}
