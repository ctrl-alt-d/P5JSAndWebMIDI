


/* ----- */

let alcada_tecla_blanca = 0.0;
let amplada_tecla_blanca = 0.0;
let alcada_tecla_negra = 0.0;
let amplada_tecla_negra = 0.0;
let tecles = {};
let midiData = null;
let midiSuccess = false;
let sonantara = [];
let millisbase = null;
let notesmaesquerra = null;
let notesmadereta = null;

function setup(){
    var myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('viz2');
    background(0);    
    preparaTecles();
    calculaTecles();
    loadMidiFile();
    millisbase = millis();
}

function draw(){
    //MidiStart();
    background(0);
    noStroke();
    pintaNotes();
    pintaTecles();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    calculaTecles();
}

/* -- Midi File -- 

https://github.com/Tonejs/MidiConvert

*/
function loadMidiFile()
{   
    url = new URL(location);
    file = "../assets/lanative.mid";
    MidiConvert.load(file, loadMidiFile2 );
}

function loadMidiFile2(midi) {
    // si té dos tracks: 1 -> ma esquerra, 2 -> ma dereta
    numerodetracks = midi.tracks.length;
    if ( numerodetracks < 2 || numerodetracks > 3 ) console.log("midi no suportart. Ha de tenir 2 o 3 trakcs");
    primertrack = numerodetracks == 2 ? 0 : 1; 
    
    notesmaesquerra = midi.tracks[0 + primertrack].notes;
    notesmadereta = midi.tracks[1 + primertrack].notes;
}


/* -- MIDI Controller -- */


/* --- END MIDI Controller-- */



/* ---- Helpers ---- */

function preparaTecles(i)
{
    negresoffset = { 1: null, 3: null, 6: null, 8: null, 10: null  };

    // 21 a 108
    pos = -1;
    for (let i = 21; i <= 108; i++)
    {
        notaabsoluta = ( i % 12 );
        esnegra = notaabsoluta in negresoffset;
        if (!esnegra) pos++;
        tecles[i] = { esnegra: esnegra,
                      displaynum: pos,
                      notaabsoluta: notaabsoluta,
                      estapremuda: false,
                      desplacamentesquerra: null,
                      desplacamentbaix: null,
                      strokeWeight: null,
                      fill: null,
                      particles: null
                    }
    }
}

function calculaTecles()
{
    numblanques = Object.values(tecles).filter((obj) => !obj.esnegra).length;

    // tamanys
    amplada_tecla_blanca = windowWidth / numblanques;
    alcada_tecla_blanca = amplada_tecla_blanca * 2;
    amplada_tecla_negra = 0.8 * amplada_tecla_blanca;
    alcada_tecla_negra = (4/6) * alcada_tecla_blanca;
    delta_negra = alcada_tecla_blanca - alcada_tecla_negra;

    // offset negres
    negresoffset = { 
        0: 0,
        1: 1/2 * amplada_tecla_blanca, 
        2: 0,
        3: 1.5 * amplada_tecla_blanca - amplada_tecla_negra,
        4: 0,
        5: 0,
        6: 1/2 * amplada_tecla_blanca, 
        7: 0,
        8: amplada_tecla_blanca - 0.5 * amplada_tecla_negra,
        9: 0,
        10: 1.5 * amplada_tecla_blanca - amplada_tecla_negra,
        11: 0  };

    // final
    for (let i = 21; i <= 108; i++)
    {
        tecles[i].desplacamentesquerra = negresoffset[ tecles[i].notaabsoluta ];
        tecles[i].desplacamentbaix = tecles[i].esnegra ? delta_negra : 0 ;
        tecles[i].strokeWeight = tecles[i].esnegra ? 2 : 2 ;
        tecles[i].fill = tecles[i].esnegra ? 12 : 255 ;
        strokeWeight
    }

}

function pintaTecles(i)
{
    stroke('rgb(0,255,0)');
    //pinta blanques
    for (let i = 21; i <= 108; i++)
    {
        //tecla
        tecla = tecles[i];

        //guies
        strokeWeight(1);
        stroke("#202020");
        if (tecla.notaabsoluta==0 || tecla.notaabsoluta==5 )
        {
            line( tecla.displaynum * amplada_tecla_blanca, 0, tecla.displaynum * amplada_tecla_blanca, windowHeight );
        }

        //tecles
        if (tecla.esnegra) continue;
        fill( tecla.estapremuda ? ( sonantara.includes(i) ? '#00FF00' : '#FF0000') 
                                : ( sonantara.includes(i) ? '#404040' : tecla.fill ));
        strokeWeight( tecla.strokeWeight)
        rect( tecla.displaynum * amplada_tecla_blanca + tecla.desplacamentesquerra, 
              windowHeight - tecla.desplacamentbaix , 
              tecla.esnegra ? amplada_tecla_negra : amplada_tecla_blanca, 
              tecla.esnegra ? -alcada_tecla_negra : -alcada_tecla_blanca);
    }

    //pinta negres
    for (let i = 21; i <= 108; i++)
    {
        tecla = tecles[i];
        if (!tecla.esnegra) continue;
        fill( tecla.estapremuda ? ( sonantara.includes(i) ? '#00FF00' : '#FF0000') 
                                : ( sonantara.includes(i) ? '#404040' : tecla.fill ));
        strokeWeight( tecla.strokeWeight)
        rect( tecla.displaynum * amplada_tecla_blanca + tecla.desplacamentesquerra, 
              windowHeight - tecla.desplacamentbaix , 
              tecla.esnegra ? amplada_tecla_negra : amplada_tecla_blanca, 
              tecla.esnegra ? -alcada_tecla_negra : -alcada_tecla_blanca);
    }

}

function pintaNotes()
{
    stroke(1);

    sonantara = [];
    if (notesmaesquerra != null ) notesmaesquerra.forEach( x => pintaNota(x, false, true ) );
    if (notesmadereta != null ) notesmadereta.forEach( x => pintaNota(x, false, false) );
    if (notesmaesquerra != null ) notesmaesquerra.forEach( x => pintaNota(x, true, true) );
    if (notesmadereta != null ) notesmadereta.forEach( x => pintaNota(x, true, false) );

}

function pintaNota (nota, lesnegres, esmaesquerra ) {
    if (nota.midi in tecles)
    {
        rati = 0.25;
        tecla = tecles[nota.midi];
        if (tecla.esnegra != lesnegres ) return;
        colornota = !esmaesquerra ?
        ( lesnegres ? "#101010" : "#101010" ) :
        ( lesnegres ? "#101010" : "#101010" ) ;
        fill( colornota );
        base = rati * ( currentMillis() - (nota.time * 1000) );
        alcada = rati * (nota.duration * 1000);

        strokeWeight(0);
        stroke(colornota);
        rect( tecla.displaynum * amplada_tecla_blanca + tecla.desplacamentesquerra, 
            base-alcada, 
            tecla.esnegra ? amplada_tecla_negra : amplada_tecla_blanca, 
            alcada,
            lesnegres ? 10 : 2 ) ;
        
        //comprovo si està sonant:
        estasonant = base-alcada <= ( windowHeight-alcada_tecla_blanca )  
                     && ( windowHeight-alcada_tecla_blanca ) <= (base);
        if (estasonant) 
        {
            sonantara.push(nota.midi);
        }
    }
}


function currentMillis()
{ 
    return (millis() - millisbase) / 1.5;
}
