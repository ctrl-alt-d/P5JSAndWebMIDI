
function escalfaForn( temperatura, delegat  ) {
    console.log("començo a escalfar");
    setTimeout(       
            delegat ,         
            temperatura * 10    
        );
}

function avisa() {
    console.log("el forn està calent");
}

escalfaForn(200, avisa );

/* -- Altres exemples -- */

/* -- funció anònima --

function escalfaForn( temperatura  ) {
    console.log("començo a escalfar");
    setTimeout(  
        
        function () { console.log("el forn està calent"); } ,         
        temperatura * 10 
    
    );
}

--*/

/* -- funció anònima notació arrow --

function escalfaForn( temperatura  ) {
    console.log("començo a escalfar");
    setTimeout(  
        
        () => console.log("el forn està calent") ,         
        temperatura * 10 
    
    );
}

--*/
