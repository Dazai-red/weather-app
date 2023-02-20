window.addEventListener('load', ()=> {

    buttonOpenRecord = document.getElementById('open-record')
    buttonCloseRecord = document.getElementById('close-record');
    buttonClearRecord = document.getElementById('clear-record');
    windowRecord = document.getElementById('window-record');
    containerRecord = document.getElementById('record-container');
    
    
    windowErrors = document.getElementById('window-errors');
    buttonCloseErrors = document.getElementById('close-errors');
    containerErrors = document.getElementById('errors-container');

    buttonOpenRecord.addEventListener('click', () => {
        containerRecord.innerHTML = getDataFromBrowser();
        windowRecord.classList.add('window-record--open');
    });

    buttonCloseRecord.addEventListener('click', ()=> {
        windowRecord.classList.remove('window-record--open');
    });
    
    buttonClearRecord.addEventListener('click', ()=>{
        localStorage.clear();
        containerRecord.innerHTML = '';
    });
        
    buttonCloseErrors.addEventListener('click', () =>{
        windowErrors.classList.remove('window-errors--open');   
    });

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoPosOk, geoPosKo);
    }else{
        console.log('Tu navegador no dispone de la API de geolocalización');
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
    
    printErrors(msg);

}

const printErrors = (error) => {
    windowErrors.classList.add('window-errors--open');
    containerErrors.innerHTML = error;
}

const getWeatherByCoords = async(lat, lon) =>{
    try{
        
        const reply  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=`)

        if(getStatus(reply.status)==="succesfull"){
            const data = await reply.json();
            
            console.log(data);
            
            printData(data.name,data.main.temp,data.weather[0].description,data.main.feels_like,data.main.humidity,data.main.pressure,data.wind.speed,data.main.temp_max,data.main.temp_min,data.weather[0].main);

            setDataInBrowser(data.name,data.main.temp,data.main.temp_max,data.main.temp_min)



        }else{
            // imprimimos los errores con la función imprimir errores
            printErrors(getStatus(reply.status));
        }

    } catch(error){
        console.warn(error.message);
        printErrors(error.message);
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

const printData = (city,temp,desc,feels,humidity,pressure,windSpeed,tempMax,tempMin,dataWeather)=>{
    
    const dateDiv = document.getElementById('date');
    const cityDiv = document.getElementById('city');
    const iconDiv = document.getElementById('icon');
    const tempDiv = document.getElementById('temp');
    const descDiv = document.getElementById('desc');
    const tempMaxDiv = document.getElementById('tempMax');
    const tempMinDiv = document.getElementById('tempMin');
    const humidityDiv = document.getElementById('humidity');
    const windSpeedDiv = document.getElementById('windSpeed');
    const pressureDiv = document.getElementById('pressure');
    const feelsDiv = document.getElementById('feels');
    
    // icono
    iconDiv.innerHTML =  `<img src="${getIcon(dataWeather)}" alt="icono">`;
    // fecha y hora de los datos
    dateDiv.innerHTML = getDateTime();
    // nombre de la ciudad
    cityDiv.innerHTML = city;
    // temperatura
    tempDiv.innerHTML = `<span class='value-temp' id='valueTemp'>${Math.round(temp)}</span><span class='extent-temp' id='extentTemp'>°C</span>`;
    //Descripción del clima
    descDiv.innerHTML = desc;
    // temperatura máx y min
    tempMaxDiv.innerHTML = `<span class='title'>Temperatura Max: </span><span class='value-tempMax' id='valueTempMax'>${Math.round(tempMax)}</span><span id='extentTempMax'>°C</span>`;
    tempMinDiv.innerHTML = `<span class='title'>Temperatura Min: </span><span class='value-tempMin' id='valueTempMin'>${Math.round(tempMin)}</span><span id='extentTempMin'>°C</span>`;
    //sensación térmica
    feelsDiv.innerHTML = `<span class='title'>Sensación térmica: </span><span class='value-feels' id='valueFeels'>${Math.round(feels)}</span><span id='extentFeels'>°C</span>`;
    // Humedad
    humidityDiv.innerHTML = `<span class='title'>Humedad: </span><span class='value'>${humidity}%</span>`;
    // presión
    pressureDiv.innerHTML = `<span class='title'>Presión: </span><span class='value'>${pressure}mbar</span>`;
    // velocidad de viento
    windSpeedDiv.innerHTML = `<span class='title'>Velocidad del viento: </span><span class='value'>${windSpeed}m/s</span>`


}

const getDateTime = () =>{

    const now = new Date();
    let hour = now.getHours();
    let min = now.getMinutes();

    const dayWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const monthYear = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    hour = hour % 12;
    if(hour < 10)
        hour = "0" + hour;
    if(min < 10){
        min = "0" + min;
    }

    return `${dayWeek[now.getDay()]} ${now.getDate()} de ${monthYear[now.getMonth()]} de ${now.getFullYear()}, ${hour}:${min}`;
}


const getIcon = (WeatherDesc) =>{
    if(WeatherDesc === 'Clear')
        // Limpio
        return 'assets/icons/day.svg';
    else if(WeatherDesc === 'Thunderstorm')
        // Tormenta
        return 'assets/icons/thunder.svg';
    else if(WeatherDesc === 'Drizzle')
        // LLovizna
        return 'assets/icons/rainy-2.svg';
    else if(WeatherDesc === 'Rain')
        // Lluvia
        return 'assets/icons/rainy-7.svg';
    else if(WeatherDesc === 'Snow')
        // Nieve
        return 'assets/icons/snowy-6.svg';
    else if(WeatherDesc === 'Atmosphere')
        // Atmosfera
        return 'assets/icons/weather.svg';
    else if(WeatherDesc === 'Clouds')
        // Nubes
        return 'assets/icons/cloudy-day-1.svg';
    else{
        // Por defecto
        return 'assets/icons/cloudy-day-1.svg';
    }
}

const setDataInBrowser =  (city,temp,tempMax,tempMin) => {

    if(typeof(Storage)!== "undefined"){
        temp = Math.round(temp);
        tempMax = Math.round(tempMax);
        tempMin = Math.round(tempMin);

        let localItems = JSON.parse(localStorage.getItem('localItem'))

        if(localItems === null){
            record = []
        }else{
            record = localItems;
        }
        record.push(`<div class='item'><div class='item__city'>${city}</div><div class='item__temps'>${tempMax} / ${tempMin}</div><div class='item__main-temp'>${temp}</div></div>`);
        localStorage.setItem('localitem', JSON.stringify(record))
        console.log('Se guardaron los datos correctamente en LocalStorage')

    }else{
        printErrors('Su navegador no soporta LocalStorage')
    }
    

}

const getDataFromBrowser = () =>{ 
    if(typeof(Storage)!== "undefined"){
        
        let outPut = '';
        let localItems = JSON.parse(localStorage.getItem('localitem'));    
        // console.log(typeof(localItems));

        if(localItems === null){
            record = []
        }else{
            record = localItems;
        }

        record.forEach((data, index) => {
            outPut += `${data}`;
        });

        return outPut;

    }else{
        return 'Su navegador no soporta LocalStorage';
    }
}









