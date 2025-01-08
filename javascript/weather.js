// Initialize default settings
let currCity = 'Oradea'; // Default city
let units = 'metric'; // Default units: 'metric' or 'imperial'
let mapInstance = null; // Leaflet map instance
let userLat = 46.7694; // Default latitude for Oradea
let userLon = 23.5899; // Default longitude for Oradea

// Select DOM elements
const city = document.querySelector(".weatherCity");
const dateTime = document.querySelector(".weatherDateTime");
const weatherForecast = document.querySelector(".weatherForcast");
const weatherIcon = document.querySelector(".weatherIcon");
const weatherTemp = document.querySelector(".weatherTemperature");
const weatherMinMax = document.querySelector(".weatherMinMax");
const weatherRealFeel = document.querySelector(".weatherRealFeel");
const weatherHumidity = document.querySelector(".weatherHumidity");
const weatherWind = document.querySelector(".weatherWind");
const weatherPressure = document.querySelector(".weatherPressure");

const popup = document.getElementById('location-popup');
const acceptButton = document.getElementById('accept-location');
const denyButton = document.getElementById('deny-location');

const forecastCard = document.getElementById("forecastCard");
const forecastPopup = document.getElementById("forecastPopup");
const closeForecastPopup = document.querySelector(".closeForecastPopup");

const mapCard = document.getElementById("mapCard");
const mapPopup = document.getElementById("mapPopup");
const closePopup = document.querySelector(".closePopup");

// **Important:** Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key.
// For security reasons, consider storing your API key in environment variables or using a backend proxy.
const API_KEY = '5e7f51bafd97fee462731ad9c72298d2';

// Function to request user location
function requestLocation() {
    // Display the location permission popup
    popup.style.display = 'block';

    // Event listener for accepting location access
    acceptButton.addEventListener('click', () => {
        // Hide the popup
        popup.style.display = 'none';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation is not supported by this browser.");
            getWeather(); // Use default city if geolocation is not supported
        }
    });

    // Event listener for denying location access
    denyButton.addEventListener('click', () => {
        // Hide the popup
        popup.style.display = 'none';
        getWeather(); // Use default city if user denies location access
    });
}

// Function to handle successful geolocation
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    userLat = lat;
    userLon = lon;

    getWeatherByCoordinates(lat, lon); // Fetch weather data based on coordinates

    // **Do not** initialize the map here to prevent automatic popup
    // The map will only be initialized when the user clicks on the "Map View" card
}

// Function to handle geolocation errors
function showError(error) {
    alert("Cannot access location.");
    getWeather(); // Use default city if there's an error accessing location
}

// Function to fetch weather data based on coordinates
function getWeatherByCoordinates(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            currCity = data.name; // Update current city based on coordinates
            displayWeather(data);
        })
        .catch(err => console.error("Error fetching weather by coordinates: ", err));
}

// Function to fetch weather data based on city name
function getWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            displayWeather(data);
            get5DayForecast(); // Fetch 5-day forecast after current weather
        })
        .catch(err => console.error("Error fetching weather: ", err));
}

// Function to fetch 5-day weather forecast
function get5DayForecast() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            display5DayForecast(data);
        })
        .catch(err => console.error("Error fetching 5-day forecast: ", err));
}

// Event listener to open forecast popup
forecastCard.addEventListener("click", () => {
    forecastPopup.style.display = "block";
    get5DayForecast(); // Fetch and display the 5-day forecast
});

// Event listener to close forecast popup
closeForecastPopup.addEventListener("click", () => {
    forecastPopup.style.display = "none";
});

// Function to display 5-day forecast data in the popup
function display5DayForecast(data) {
    const forecastContainer = document.querySelector(".forecastCardsContainer");
    forecastContainer.innerHTML = ''; // Clear previous forecast data

    const forecastList = data.list;

    // Loop through the forecastList every 8th element (3-hour intervals, 8 entries per day)
    for (let i = 0; i < forecastList.length; i += 8) {
        const forecast = forecastList[i];
        const date = convertTimeStamp(forecast.dt, data.city.timezone);
        const temp = forecast.main.temp.toFixed();
        const icon = forecast.weather[0].icon;
        const weatherDesc = forecast.weather[0].main;

        // Create forecast card element
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('weatherCard');
        forecastCard.innerHTML = `
            <div class="forecastDate">${date}</div>
            <div class="forecastIcon"><img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon"></div>
            <div class="forecastTemp">${temp}&#176 ${units === "metric" ? "C" : "F"}</div>
            <div class="forecastDesc">${weatherDesc}</div>
        `;

        // Append the created card to the forecast container
        forecastContainer.appendChild(forecastCard);
    }
}

// Function to display weather data on the page
function displayWeather(data) {
    city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
    dateTime.innerHTML = convertTimeStamp(data.dt, data.timezone);
    weatherForecast.innerHTML = `<p>${data.weather[0].main}</p>`;
    weatherTemp.innerHTML = `${data.main.temp.toFixed()}&#176${units === "metric" ? "C" : "F"}`;
    weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="weather icon">`;
    weatherMinMax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176${units === "metric" ? "C" : "F"}</p>
                               <p>Max: ${data.main.temp_max.toFixed()}&#176${units === "metric" ? "C" : "F"}</p>`;
    weatherRealFeel.innerHTML = `<p>Real feel: ${data.main.feels_like.toFixed()}&#176${units === "metric" ? "C" : "F"}</p>`;
    weatherHumidity.innerHTML = `<p>Humidity: ${data.main.humidity}%</p>`;
    weatherWind.innerHTML = `<p>Wind: ${units === "imperial" ? 
        (data.wind.speed * 2.23694).toFixed() : 
        (data.wind.speed * 3.6).toFixed()} ${units === "imperial" ? "mph" : "km/h"}</p>`;
    weatherPressure.innerHTML = `<p>Pressure: ${data.main.pressure} hPa</p>`;
}

// Function to convert timestamp to a readable format based on timezone
function convertTimeStamp(timestamp, timezone){
    const convertTimezone = timezone / 3600;
    const date = new Date(timestamp * 1000);
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
}

// Function to convert country code to country name
function convertCountryCode(country){
    let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
    return regionNames.of(country);
}

// Event listener for manual city search submission
document.querySelector(".weatherSearch").addEventListener('submit', e => {
    let search = document.querySelector(".weatherSearchForm");
    e.preventDefault();

    const query = search.value.trim();
    if (query === "") {
        alert("Please enter a city name.");
        return;
    }

    currCity = query;
    getWeather();
    search.value = "";
});

// Event listeners for unit changes (Celsius and Fahrenheit)
document.querySelector(".weatherUnitCelsius").addEventListener('click', () => {
    if(units !== 'metric') {
        units = 'metric';
        getWeather();    
    }
});

document.querySelector(".weatherUnitFahrenheit").addEventListener('click', () => {
    if(units !== "imperial"){  
        units = "imperial";
        getWeather();
    }
});

// Event listener for page load to request user's location
window.addEventListener('load', requestLocation);

// Event listener to open the map popup
mapCard.addEventListener("click", () => {
    mapPopup.style.display = "flex";
    initializeWeatherMapInPopup(userLat, userLon); // Initialize the map when popup is opened
});

// Event listener to close the map popup
closePopup.addEventListener("click", () => {
    mapPopup.style.display = "none";
});

// Function to initialize the Leaflet map in the popup
function initializeWeatherMapInPopup(userLat, userLon, layer = 'precipitation_new', zoom = 5) {
    const mapContainer = document.getElementById('popupWeatherMap');

    // Check if a map instance already exists
    if (mapInstance) {
        // Update the map's view if it exists
        mapInstance.setView([userLat, userLon], zoom);
        return;
    }

    // Create a new Leaflet map instance
    mapInstance = L.map(mapContainer).setView([userLat, userLon], zoom);

    // Add OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    // Add OpenWeatherMap weather layer
    const weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`, {
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
        opacity: 0.5 // Adjust opacity as needed
    }).addTo(mapInstance);

    // Add layer control to switch between different weather layers
    const baseMaps = {
        "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    };

    const overlayMaps = {
        "Precipitation": L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`),
        "Clouds": L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`),
        "Temperature": L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`),
        "Wind": L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`)
    };

    L.control.layers(baseMaps, overlayMaps).addTo(mapInstance);
}
