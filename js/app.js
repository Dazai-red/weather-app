window.addEventListener('load', ()=> {

    background = document.getElementById('background');
    openRecordButton = document.getElementById('record-button')
    closeRecordbutton = document.getElementById('close-record-button');
    clearRecordButton = document.getElementById('clear-record-button');
    recordWindow = document.getElementById('record-window');
    recordContainer = document.getElementById('record-container');
    
    errorWindow = document.getElementById('error-window');
    closeErrorsButton = document.getElementById('close-error-window-button');
    errorContainer = document.getElementById('error-container');

    cityForm = document.getElementById('city-form');
    cityInput = document.getElementById('city-input');

    converterButton = document.getElementById('converter-button');

    openRecordButton.addEventListener('click', () => {
        recordContainer.innerHTML = getDataFromBrowser();
        recordWindow.classList.add('record-window--open');
    });

    closeRecordbutton.addEventListener('click', ()=> {
        recordWindow.classList.remove('record-window--open');
    });
    
    clearRecordButton.addEventListener('click', ()=>{
        localStorage.clear();
        recordContainer.innerHTML = '';
    });
        
    closeErrorsButton.addEventListener('click', () =>{
        errorWindow.classList.remove('error-window--open');   
    });

    cityForm.addEventListener('submit', event =>{
        event.preventDefault();
        console.log(cityInput.value);
        getWeatherByCity(cityInput.value);
    });

    converterButton.addEventListener('click', () => {
        
        // antes de hacer una petición a la api estos span no existen
        const valueTemp = document.getElementById('value-temp-box');
        const extentTemp = document.getElementById('extent-temp-box');
        const valueTempMax = document.getElementById('value-temp-max-box');
        const valueTempMin = document.getElementById('value-temp-min-box');
        const valueFeels = document.getElementById('feels-value-box');

        let pressed = converterButton.classList.contains('interactive__converter-button--pressed');
        // Si no le damos permiso de geo no tendremos estos span generados 
        if(valueTemp!=null){
            if(pressed){
                converterButton.classList.remove('interactive__converter-button--pressed');
                valueTemp.textContent = Math.round(getFahrenheitToCelsius(valueTemp.innerHTML));
                extentTemp.textContent = '°C';
                valueTempMax.textContent = Math.round(getFahrenheitToCelsius(valueTempMax.innerHTML));
                valueTempMin.textContent = Math.round(getFahrenheitToCelsius(valueTempMin.innerHTML));
                valueFeels.textContent = Math.round(getFahrenheitToCelsius(valueFeels.innerHTML));
            }else{
                converterButton.classList.add('interactive__converter-button--pressed');
                valueTemp.textContent = Math.round(getCelsiusToFahrenheit(valueTemp.innerHTML));
                extentTemp.textContent = '°F';
                valueTempMax.textContent = Math.round(getCelsiusToFahrenheit(valueTempMax.innerHTML));
                valueTempMin.textContent = Math.round(getCelsiusToFahrenheit(valueTempMin.innerHTML));
                valueFeels.textContent = Math.round(getCelsiusToFahrenheit(valueFeels.innerHTML));
            }
        }
    });

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geoPosOk, geoPosKo);
    }else{
        printErrors('Tu navegador no dispone de la API de geolocalización');
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
    errorWindow.classList.add('error-window--open');
    errorContainer.innerHTML = error;
}

const getWeatherByCoords = async(lat, lon) =>{
    try{
        
        const reply  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=76a6edce82b8fe2b82f08402000b1d77`)

        if(getStatus(reply.status)==="succesfull"){
            
            const data = await reply.json();
            
            console.log(data);
            
            // imprime los datos 
            printData(data.name,data.main.temp,data.weather[0].description,data.main.feels_like,data.main.humidity,data.main.pressure,data.wind.speed,data.main.temp_max,data.main.temp_min,data.weather[0].main);

            // Pasa los datos al LocalStorage del navegador del cliente
            setDataInBrowser(data.name,data.main.temp,data.main.temp_max,data.main.temp_min)

            // le pasamos el dataTime de cuando se hizo la petición
            setBackgroundImage(data.dt);

        }else{
            // imprimimos los errores con la función imprimir errores
            console.warn(getStatus(reply.status));
            printErrors(getStatus(reply.status));
        }

    } catch(error){
        console.warn(error.message);
        printErrors(error.message);
    }
}

const getWeatherByCity = async (city) => {
    try{
        
        const reply  = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=es&units=metric&appid=76a6edce82b8fe2b82f08402000b1d77`)

        if(getStatus(reply.status)==="succesfull"){
            
            const data = await reply.json();
            
            console.log(data);
            
            // imprime los datos 
            printData(data.name,data.main.temp,data.weather[0].description,data.main.feels_like,data.main.humidity,data.main.pressure,data.wind.speed,data.main.temp_max,data.main.temp_min,data.weather[0].main);

            // Pasa los datos al LocalStorage del navegador del cliente
            setDataInBrowser(data.name,data.main.temp,data.main.temp_max,data.main.temp_min)

            // le pasamos el dataTime de cuando se hizo la petición
            setBackgroundImage(data.dt);

        }else{
            // imprimimos los errores con la función imprimir errores
            console.warn(getStatus(reply.status));
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
        return "ERROR 401: API KEY INVALIDA";
    }else if(status === 404){
        return "ERROR 404: Ciudad no valida";
    }else if(status === 400){
        return "ERROR 400: No has introducido ciudad";
    }else{
        return "ERROR DESCONOCIDO.";
    }
}

const printData = (city,temp,desc,feels,humidity,pressure,windSpeed,tempMax,tempMin,dataWeather)=>{
    
    const dateDiv = document.getElementById('date-and-time-box');
    const cityDiv = document.getElementById('city-name-box');
    const iconDiv = document.getElementById('icon-box');
    const tempDiv = document.getElementById('value-temp-box');
    const descDiv = document.getElementById('desc-temp-box');
    const tempMaxDiv = document.getElementById('value-temp-max-box');
    const tempMinDiv = document.getElementById('value-temp-min-box');
    const humidityDiv = document.getElementById('humidity-value-box');
    const windSpeedDiv = document.getElementById('wind-speed-box');
    const pressureDiv = document.getElementById('presure-box');
    const feelsDiv = document.getElementById('feels-value-box');
    
    // icono
    iconDiv.innerHTML =  `<img src="${getIcon(dataWeather)}" alt="icono">`;
    // fecha y hora de los datos
    dateDiv.innerHTML = getDateTime();
    // nombre de la ciudad
    cityDiv.innerHTML = city;
    // temperatura
    tempDiv.innerHTML = Math.round(temp);
    //Descripción del clima
    descDiv.innerHTML = desc;
    // temperatura máx y min
    tempMaxDiv.innerHTML = Math.round(tempMax);
    tempMinDiv.innerHTML = Math.round(tempMin);
    //sensación térmica
    feelsDiv.innerHTML = Math.round(feels);
    // Humedad
    humidityDiv.innerHTML = `${humidity}%`;
    // presión
    pressureDiv.innerHTML = `${pressure}mbar`;
    // velocidad de viento
    windSpeedDiv.innerHTML = `${windSpeed}m/s`


}

const getDateTime = () =>{

    /* 
        Otra forma de hacerlo pero más compleja:
        let date = new Date().toLocaleString("es-ES", {
            timeStyle: "long",
            dateStyle: "short",
            hour12: true
        });
        console.log(date); Nos daria el siguiente formato: 21/2/23, 1:11:03 p. m. CET
    */

    const now = new Date();
    let hour = now.getHours();
    let min = now.getMinutes();
    let system = '';

    const dayWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const monthYear = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    
    
    if(hour > 12){
        system = 'PM'
    }else{
        system = 'AM'
    }

    hour = hour % 12;
    if(hour < 10)
        hour = "0" + hour;
    if(min < 10){
        min = "0" + min;
    }

    return `${dayWeek[now.getDay()]} ${now.getDate()} de ${monthYear[now.getMonth()]} de ${now.getFullYear()}, ${hour}:${min} ${system}`;
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
        /* 
            <li class="record-container__item">
                <div class="separator">
                    <div class='item__city'>${city}</div>
                    <div class='item__temps'>${tempMax}<sup>°</sup> / ${tempMin}<sup>°</sup></div>
                </div>
                <div class='item__main-temp'>${temp}<sup>°</sup></div>
            </li>
        */
        record.push(`<li class="record-container__item"><div class="separator"><div class='item__city'>${city}</div><div class='item__temps'>${tempMax}<sup>°</sup> / ${tempMin}<sup>°</sup></div></div><div class='item__main-temp'>${temp}<sup>°</sup></div></li>`);
        localStorage.setItem('localItem', JSON.stringify(record))
        console.log('Se guardaron los datos correctamente en LocalStorage')

    }else{
        printErrors('Su navegador no soporta LocalStorage')
    }
    

}

const getDataFromBrowser = () =>{ 
    if(typeof(Storage)!== "undefined"){
        
        let localItems = JSON.parse(localStorage.getItem('localItem'))
        
        let outPut = '';

        console.log(localItems);

        if(localItems === null){
            arrayRecord = []
        }else{
            arrayRecord = localItems;
        }

        arrayRecord.forEach((content, index) => {
            outPut += content;
        });

        return outPut;

    }else{
        printErrors('Su navegador no soporta LocalStorage');
        return '';
    }
}

const setBackgroundImage = (dateTime) =>{
    /* 
        dateTime es un número que indica:
        Tiempo Unix o Tiempo POSIX es un sistema para la 
        descripción de instantes de tiempo: se define como 
        la cantidad de segundos transcurridos desde la 
        medianoche UTC del 1 de enero de 1970, sin contar 
        segundos intercalares.
    */
    // convierte tiempo unix a una hora entendible 
    const dayHour = new Date(dateTime*1000).getHours();
    // console.log(dayHour);
    if(dayHour > 6 && dayHour < 18){
        background.classList.remove('background--night');
        background.classList.add('background--day');
    }else{
        background.classList.remove('background--day');
        background.classList.add('background--night');
    }
}

const getCelsiusToFahrenheit = (celsius) => {
    return celsius * 9 / 5.0 + 32;
}

const getFahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9.0;
}













