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
    
    if (missatge.data[0] == 144) {
        noteOn( missatge.data[1],missatge.data[2] );
    } else if (missatge.data[0] == 128) {
        noteOff( missatge.data[1] );
    } else {
        console.log("m'arriba missatge", missatge);
    }

}

function quanCanviiEstatPortMidi( canvi ) {
    canvi.port.onmidimessage = quanArribaUnMissatgeMidi;
}

function noteOn( nota, atac ) {
    console.log("arriba nota", nota, atac);
    ellipse(random(windowWidth), random(windowHeight), nota, nota);
}

function noteOff( nota ) {
    console.log("finalitza nota", nota);
}