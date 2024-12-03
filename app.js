const apiKey = 'c2226dc8f5afa5196adff0c39594e06a'

const searchBox = document.querySelector('#location-search')
const searchBtn = document.querySelector('#location-button')
const weatherbox = document.querySelector('.display')


searchBtn.addEventListener('click', (e)=> {
    e.preventDefault()
    const location = searchBox.value

    if(!location) {
       alert('Please add a location')
       return; 
    }

    getData(location)
})


async function getData(location) {

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();
        console.log(json)
        const {name, lon, lat} = json[0]
        weatherArea(name, lon, lat)

    }
    
    catch (err) {
        const errorMessage = document.createElement('h2')
        errorMessage.textContent = err
        weatherbox.appendChild(errorMessage)
    }

}

async function weatherArea (name, lon, lat) {

    try {

        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=daily,minutely&appid=${apiKey}`

        const response = await fetch(url)
        
        if (!response.ok){
            throw new Error(`Response status: ${response.status}`)
        }

        const data = await response.json()

        const {current, timezone_offset} = data

        buildWeatherCard(name, current, timezone_offset)

    } 
    
    catch(err){
        const errorMessage = document.createElement('h2')
        errorMessage.textContent = err
        weatherbox.appendChild(errorMessage)
    } 

}

function buildWeatherCard(name, current, timezone_offset){

    const {temp, humidity, wind_speed, weather, sunset, sunrise} = current

    const sunriseTime = getTime(sunrise, timezone_offset)
    const sunsetTime = getTime(sunset, timezone_offset)

    console.log()
    console.log()
    console.log()

    const sunriseContainer = document.createElement('div')
    sunriseContainer.innerText = getTime(sunrise, timezone_offset)

    const sunsetContainer = document.createElement('div')
    sunsetContainer.innerText = `image here${getTime(sunset, timezone_offset)}`

    weatherbox.innerHTML = ""

    const conditions = weatherConditions(weather[0])

    const allWeather = document.createElement('img')
    allWeather.src = `images/${conditions}.png`

    const temperature = document.createElement('div')
    temperature.classList.add('temperature')

    const weatherDesc = document.createElement('div')
    weatherDesc.classList.add('weather-description')

    const windSpeed = document.createElement('div')
    const humid = document.createElement('div')

    const nameLocation = document.createElement('div')
    
    temperature.textContent = `${Math.round(temp)}°C`
    weatherDesc.textContent = weather[0].description
    windSpeed.textContent = `Wind speed ${wind_speed}mph`
    humid.textContent = `Humidity ${humidity}%`
    nameLocation.textContent = `${name}`

    weatherbox.appendChild(allWeather)
    weatherbox.appendChild(temperature)
    weatherbox.appendChild(weatherDesc)
    weatherbox.appendChild(windSpeed)
    weatherbox.appendChild(humid)
    weatherbox.appendChild(nameLocation)
    weatherbox.appendChild(sunriseContainer)
    weatherbox.appendChild(sunsetContainer)
    
}

function weatherConditions (condition) {

    let image 

    switch (condition.main) {
        case "Clear":
            image = `weather_clear` 
        break;
        case "Clouds" :
            image = `weather_cloudy`
        break;
        case "Rain":
            image = `weather_rain`
        break;
        case "Snow":
            image = `weather_snow`
        break;

        default:
            image = `weather_clear`    
    }

    return image

}

function getTime(time, timezone_offset){

    const date = new Date ((time + timezone_offset) * 1000)
    const hours = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours()
    const mins = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes()

    const fullTime = `${hours}:${mins}${hours >= 12 ? "pm" : "am"}`

    return fullTime

}

