window.addEventListener('load', ()=>{

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoPosOk, geoPosKo)
    }else{
        console.log('Tu navegador no dispone de la API de geolocalización')
    }

});

function geoPosOk(pos){
    let lat = pos.coords.latitude;
    let lon = pos.coords.longitude;

    console.log(`Estas en la posición: ${lat}, ${lon}`);

    getWeatherByCoords(lat,lon);

}

function geoPosKo(err){
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

const getWeatherByCoords = async(lat, lon) =>{
    try{
        
        const reply  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=8888a7546eef15137503e5dea18fcd7f`)

        if(getStatus(reply.status)==="succesfull"){
            const data = await reply.json();
            console.log(data);
            
            printData(data.name,data.main.temp,data.weather[0].description,data.main.feels_like,data.main.humidity,data.main.pressure,data.wind.speed,data.main.temp_max,data.main.temp_min);

        }else{
            // imprimimos los errores con la función imprimir errores
            console.log(getStatus(reply.status));
        }

    } catch(error){
        console.warn(error.message);
    }
}

const getStatus = (status)=>{
    if(status === 200){
        return "succesfull";
    }else if(status === 401){
        return "ERROR: API KEY INVALIDA";
    }else if(status === 404){
        return "ERROR: La API no contiene este recurso";
    }else if(status === 400){
        return "ERROR: Ciudad no valida";
    }else{
        return "ERROR DESCONOCIDO.";
    }
}

const printData = (city,temp,desc,feels,humidity,pressure,windSpeed,tempMax,tempMin)=>{
    // nombre de la ciudad
    console.log(city)
    // temperatura
    console.log(`Temperatura: ${Math.round(temp)}°C`)
    //Descripción del clima
    console.log(desc)
    //sensación térmica
    console.log(`Sensación térmica: ${Math.round(feels)}°C`)
    // Humedad
    console.log(`Humedad: ${humidity}%`)
    // presión
    console.log(`Presión: ${pressure}mbar`)
    // velocidad de viento
    console.log(`Velocidad de viento: ${windSpeed} m/s`)
    // temperatura máx y min
    console.log(`Temp Max: ${Math.round(tempMax)}°C`)
    console.log(`Temp Min: ${Math.round(tempMin)}°C`)
}