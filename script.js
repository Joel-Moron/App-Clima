const api_key = 'aaeb9519c630fe9cc69c9cfe86811ecd';
const url_base = 'https://api.openweathermap.org/data/2.5/weather';
const difkelvin = 273.15;
const api_key_translate = '91632213f03f4a26ae6dcc7ae9b6a7cb';
const translate_endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=es';
const divDatosClima = document.getElementById('datosClima');

document.getElementById('botonBusqueda').addEventListener('click', () => {
    const ciudad = document.getElementById('ciudadEntrada').value;
    if (ciudad) {
        fetchDatosClima(ciudad);
    }
});

function fetchDatosClima(ciudad) {
    fetch(`${url_base}?q=${ciudad}&appid=${api_key}`)
    .then(response => response.json())
    .then(response => mostrarDatosClima(response))
    .catch(e => mostrarError(e));
}

function mostrarDatosClima(data) {
    divDatosClima.innerHTML='';

    const ciudadNombre = data.name;
    const paisNombre = data.sys.country;
    const temperatura = data.main.temp;
    const humendad = data.main.humidity;
    const descripcion = data.weather[0].description;
    const icono = data.weather[0].icon;

    const ciudadTitulo = document.createElement('h2');
    ciudadTitulo.textContent = `${ciudadNombre}, ${paisNombre}`;

    const temperaturaInfo = document.createElement('p');
    temperaturaInfo.textContent = `la temperatura es: ${Math.floor(temperatura-difkelvin)} °C`;

    const humedadInfo = document.createElement('p');
    humedadInfo.textContent = `La humendad es: ${humendad}%`;

    const iconoInfo = document.createElement('img');
    iconoInfo.src = `https://openweathermap.org/img/wn/${icono}@2x.png`;

    const descriptionInfo = document.createElement('p');

    // Traducir la descripción meteorológica
    traducirTexto(descripcion, translatedDescripcion => {
        descriptionInfo.textContent = `la descripcion meteorologica es: ${translatedDescripcion}`;
        divDatosClima.appendChild(ciudadTitulo);
        divDatosClima.appendChild(temperaturaInfo);
        divDatosClima.appendChild(humedadInfo);
        divDatosClima.appendChild(iconoInfo);
        divDatosClima.appendChild(descriptionInfo);
    });
}

function mostrarError(e) {
    console.log(e)
    divDatosClima.innerHTML='';
    const errorInfo = document.createElement('p');
    errorInfo.textContent = `No se pudo encontrar la ciudad`;
    divDatosClima.appendChild(errorInfo);
}

function traducirTexto(texto, callback) {
    const body = [{ 'text': texto }];
    fetch(translate_endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': api_key_translate,
            'Ocp-Apim-Subscription-Region': 'southcentralus'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        const translatedText = data[0].translations[0].text;
        callback(translatedText);
    })
    .catch(error => {
        console.error('Error al traducir:', error);
        callback(texto);
    });
}
