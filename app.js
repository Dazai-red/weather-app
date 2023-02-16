window.addEventListener('load', ()=>{

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoPosOK, geoPosKO)
    }else{
        console.log('Tu navegador no dispone la API de geolocalización')
    }

});

function geoPosOK(pos){
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    console.log(`Estas en la posición: ${lat}, ${lon} ` );
}

function geoPosKO(err){
    console.warn(err.message);
    let msg;
    switch(err.code){
        case err.PERMISSION_DENIED:
            msg = "No nos has dado permiso para obtener tu posición"
            break;
        case err.POSITION_UNAVAILABLE:
            msg = "Tu posición actual no está disponible"
            break;
        case err.TIMEOUT:
            msg = "No se ha podido obtener tu posición en un tiempo prudencial";
            break;
        default:
            msg = "Error desconocido";
            break;
    }
    console.log(msg);
}