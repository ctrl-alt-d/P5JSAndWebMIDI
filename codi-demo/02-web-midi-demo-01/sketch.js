let notes = ["C","C#","D","D#","E","F","F#","G","G#","A","#A","B" ];

function setup() {
    noLoop();
    inicialitzaWebMidi();
    createCanvas(windowWidth, windowHeight);
}

/* --- quan arribi una nota la pinto en un lloc random -- */

function noteOn( nota, atac ) {
    nomNota = notes[ nota % 12 ];
    console.log("arriba nota", nomNota, nota, atac);
    let x = random(windowWidth);
    let y = random(windowHeight); 
    let mida = map( atac, 0, 127, windowWidth / 80,  windowWidth / 20 );
    ellipse(x, y, mida, mida);
    textAlign(CENTER, CENTER);
    textSize(mida/2.0);
    text(nomNota, x, y);
}

function noteOff( nota ) {
    console.log("finalitza nota", nota);
}


/* --- suport web midi ---*/

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


