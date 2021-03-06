
function setup() {
    inicialitzaWebMidi();
}

/* ---- funcions a desenvolupar ---- */

function noteOn( nota, atac ) {
    console.log("arriba nota", nota, atac);
}

function noteOff( nota ) {
    console.log("finalitza nota", nota);
}

/* ---- inicialització del web midi ---- */

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

