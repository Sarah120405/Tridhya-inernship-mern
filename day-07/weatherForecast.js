const place = document.getElementById("city")
const temperature = document.getElementById("temp")
const apparentTemp = document.getElementById("apparentTemp")
const windSpeed = document.getElementById("windSpeed")
const humidity = document.getElementById("humidity");
const windDirection = document.getElementById("windDirection");
const airQuality = document.getElementById("airQuality")
const date = document.getElementById("date")
const time = document.getElementById("time");
const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById("search-input")
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const WEATHER_BASE = "https://api.open-meteo.com/v1"
const GEO_BASE = "https://geocoding-api.open-meteo.com/v1"
const AIR_QUALITY_BASE = "https://air-quality-api.open-meteo.com/v1";


function degreesToCompass(degrees) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

function formatLocalDateTime(isoLocalString) {
    const [datePart, timePart] = isoLocalString.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
 
    const localDate = new Date(year, month - 1, day, hour, minute);
 
    const dateText = localDate.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
 
    const timeText = localDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
 
    return { dateText, timeText };
}
 
function showLoading() {
    loading.style.display = "block";
    error.style.display = "none";
    searchBtn.disabled = true;
}

function hideLoading() {
    loading.style.display = "none";
    searchBtn.disabled = false;
}

function showError(message) {
    error.textContent = message;
    error.style.display = "block";
}

async function getCityCoordinates(cityName) {
    
    const response = await fetch(`${GEO_BASE}/search?name=${cityName}&count=1`)
    
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.results || data.results.length === 0) {
        throw new Error("City not found")
    }

    place.textContent = `${data.results[0].name}, ${data.results[0].country}`
    
    return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
    }
}

async function getWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,apparent_temperature,weathercode,windspeed_10m,relativehumidity_2m,precipitation,wind_direction_10m",
        timezone: "Asia/Kolkata"
    })
    
    const response = await fetch(`${WEATHER_BASE}/forecast?${params}`)
    const data = await response.json()
    
    
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }
    return data.current
}

async function getAirQuality(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: "us_aqi",
        timezone: "Asia/Kolkata",
    });
 
    const response = await fetch(`${AIR_QUALITY_BASE}/air-quality?${params}`);
    const data = await response.json();
    
    if (!response.ok) {
        // Air quality is a "nice to have" — don't fail the whole app if this one call fails
        return null;
        console.log("Air Quality not working");
        
    }
 
    return data.current;
}

async function weatherData(cityName) {
    try {
        showLoading();

        const { lat, lon } = await getCityCoordinates(cityName);

        const air = await getAirQuality(lat, lon);
        const weather = await getWeather(lat, lon);

        displayData(weather, air);

    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

function handleSearch() {
    const cityName = searchInput.value.trim();
    if (!cityName) return;
    weatherData(cityName);
}
 
searchBtn.addEventListener("click", handleSearch);
 
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

function displayData(data, airData) {
    console.log(data, airData);
    
    temperature.textContent = `${parseInt(data.temperature_2m)}°C`
    apparentTemp.textContent = `Feels Like ${data.apparent_temperature}°C`
    humidity.textContent = `${data.relativehumidity_2m} %`
    windSpeed.textContent = `${data.windspeed_10m}`
    windDirection.textContent = `${degreesToCompass(data.wind_direction_10m)}`
    const { dateText, timeText } = formatLocalDateTime(data.time);
    date.textContent = `${dateText}`
    time.textContent = `${timeText}`
    airQuality.textContent = `${airData.us_aqi}`
}
