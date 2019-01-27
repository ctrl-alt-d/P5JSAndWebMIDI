
function escalfaForn_v3( temperatura  ) {
    console.log("començo a escalfar (v3)");
    let p = new Promise(  
        function ( delegat ) { 
             setTimeout( delegat, temperatura * 10 );
        },
    );
    return p;
}

function avisa_v3() {
    console.log("el forn està calent (v3)");
}

async function escalfa_i_avisa() {
    await escalfaForn_v3(200);
    avisa_v3();
}

escalfa_i_avisa();


/* -- Altres exemples -- */

/* -- funció anònima notació arrow --

function escalfaForn( temperatura  ) {
    console.log("començo a escalfar");
    let p = new Promise(  
        delegat => setTimeout( delegat, temperatura * 10 )
    );
    return p;
}

function avisa() {
    console.log("el forn està calent");
}

escalfaForn(200).then(avisa);

--*/
