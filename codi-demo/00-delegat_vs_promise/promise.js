
function escalfaForn_as_promise( temperatura  ) {
    console.log("començo a escalfar");
    let p = new Promise(  
        function ( delegat ) { 
             setTimeout( delegat, temperatura * 10 ); 
        },
    );
    return p;
}

function avisa_v2() {
    console.log("el forn està calent");
}

escalfaForn_as_promise(200).then(avisa_v2);

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
