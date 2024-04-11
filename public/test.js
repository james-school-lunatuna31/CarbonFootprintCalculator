document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateCommuteAndWeather);
    }
});

async function calculateCommuteAndWeather() {
    const startCity = document.getElementById('startCity').value;
    const startState = document.getElementById('startState').value;
    const endCity = document.getElementById('endCity').value;
    const endState = document.getElementById('endState').value;

    // Fetch weather data for the start city
    const startWeatherData = await fetchWeatherData(startCity, startState);
    // Fetch weather data for the end city
    const endWeatherData = await fetchWeatherData(endCity, endState);
    // Fetch commute time
    const commuteTime = await fetchCommuteTime(startCity, startState, endCity, endState); // Re-enabled the fetchCommuteTime function

    // Display results
    displayResults(startWeatherData, endWeatherData, commuteTime);
}

async function fetchWeatherData(cityName, stateName) {
    const localStorageKey = `${cityName},${stateName}`;
    let data = localStorage.getItem(localStorageKey);
    if (data) {
        data = JSON.parse(data);
        // Check if the data is recent enough, for simplicity, let's assume all stored data is recent
        return data;
    } else {
        try {
            const response = await fetch(`/weather?city=${cityName},${stateName}`);
            data = await response.json();
            // Store the fetched data in local storage with location name, lat, and lon as keys
            localStorage.setItem(localStorageKey, JSON.stringify({
                ...data,
                timestamp: new Date().getTime() // Add a timestamp to check data recency later
            }));
            return data; // This will contain the weather data
        } catch (error) {
            console.error("Failed to fetch weather data", error);
            return null;
        }
    }
}

async function fetchCommuteTime(startCity, startState, endCity, endState) {
    try {
        const response = await fetch(`/commute?startCity=${startCity}&startState=${startState}&endCity=${endCity}&endState=${endState}`);
        const data = await response.json();
        return data.commuteTime; // Assuming the API returns an object with commuteTime
    } catch (error) {
        console.error("Failed to fetch commute time", error);
        return null;
    }
}

function displayResults(startWeatherData, endWeatherData, commuteTime) {
    const startLocationWeather = document.getElementById('startLocationWeather');
    const endLocationWeather = document.getElementById('endLocationWeather');
    startLocationWeather.innerHTML = `Weather in Start City: ${startWeatherData.weather[0].main}, ${convertKelvinToCelsius(startWeatherData.main.temp)}°C<br>`;
    endLocationWeather.innerHTML = `Weather in End City: ${endWeatherData.weather[0].main}, ${convertKelvinToCelsius(endWeatherData.main.temp)}°C<br>`;
    const distanceInfo = document.getElementById('distanceInfo');
    distanceInfo.innerHTML = `Commute Time: ${commuteTime}`; // Adjust based on actual commute time data structure
}
function convertKelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}
