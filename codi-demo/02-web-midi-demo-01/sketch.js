let notes = ["C","C#","D","D#","E","F","F#","G","G#","A","#A","B" ];

function setup() {
    noLoop();
    inicialitzaWebMidi();
    createCanvas(windowWidth, windowHeight);
}

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
    canvi.port.onmidimessage = quanArribaUnMissatgeMidi;
}

function noteOn( nota, atac ) {
    nomNota = notes[ nota % 12 ];
    console.log("arriba nota", nomNota, nota, atac);
    let x = random(windowWidth);
    let y = random(windowHeight); 
    ellipse(x, y, atac, atac);
    textAlign(CENTER, CENTER);
    textSize(atac/2.0);
    text(nomNota, x, y);
}

function noteOff( nota ) {
    console.log("finalitza nota", nota);
}

