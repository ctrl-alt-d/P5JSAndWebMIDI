let notes = ["C","C#","D","D#","E","F","F#","G","G#","A","#A","B" ];

function setup() {
    noLoop();
    inicialitzaWebMidi();
    createCanvas(windowWidth, windowHeight);
    background(254);
}

/* --- quan arribi una nota la pinto en un lloc random -- */

function noteOn( nota, atac ) {
    let noteColor = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', 
                  '#f58231', '#911eb4', '#46f0f0', '#f032e6', 
                  '#bcf60c', '#fabebe', '#008080', '#e6beff', 
                  '#9a6324', '#fffac8', '#800000', '#aaffc3', 
                  '#808000', '#ffd8b1', '#000075', '#808080', 
                  '#ffffff', '#000000'];
                  
    numNota = nota % 12;
    nomNota = notes[ numNota ];
    console.log("arriba nota", nomNota, nota, atac);
    let x = random( numNota*(windowWidth/12), (numNota+1)*(windowWidth/12)  );
    let y = randomGaussian(windowHeight/2, Math.sqrt(windowHeight)*3 ); 
    let mida = map( atac, 0, 127, windowWidth / 80,  windowWidth / 20 );

    noStroke();

    //esborrar tot una mica
    fill(254,254,254,2);
    rect(0,0,windowWidth,windowHeight);

    //elipse
    let c = color(noteColor[numNota]);
    c.setAlpha(200);	
    fill(color( c ));
    ellipse(x, y, mida, mida);

    //text
    fill(color( 255,255,255));
    textAlign(CENTER, CENTER);
    textSize(mida/2.0);
    text(nomNota, x, y);
}

function noteOff( nota ) {
    console.log("finalitza nota", nota);
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
