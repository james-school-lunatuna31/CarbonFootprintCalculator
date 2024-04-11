document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    switch (page) {
        case 'index.html':
            break;
        case 'calculator.html':
            initCalculator();
            break;
        default:
            console.log('No specific JavaScript for this page.');
    }
});

function initCalculator() {
    const calculateButton = document.querySelector('#calculateButton');
    calculateButton.addEventListener('click', function() {
        const carType = document.querySelector('#carType').value;
        const distance = document.querySelector('#distance').value;
        const emissions = calculateEmissions(carType, distance);
        displayResults(emissions);
    });
}

async function calculateEmissions(carType, distance) {
    const weatherData = await fetchWeatherData();
    const adjustedDistance = await fetchDistanceData();
    return adjustedDistance * 0.25;
}

function displayResults(emissions) {
    const resultsElement = document.querySelector('#results');
    resultsElement.textContent = `Your trip caused ${emissions}kg of CO2.`;
}

async function fetchWeatherData() {
    const cityName = "CityName";
    const response = await fetch(`http://localhost:3001/weather?city=${cityName}`);
    const data = await response.json();
    console.log(data);
    return data;
}

async function fetchDistanceData() {
    const origins = "Origin";
    const destinations = "Destination";
    const response = await fetch(`http://localhost:3001/distance?origins=${origins}&destinations=${destinations}`);
    const data = await response.json();
    console.log(data);
    return data.rows[0].elements[0].distance.value;
}
