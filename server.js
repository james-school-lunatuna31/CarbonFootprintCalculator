const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/weather', async (req, res) => {
    const cityName = req.query.city;
    const stateCode = req.query.state;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)},${encodeURIComponent(stateCode)},US&appid=e913dadffcdcddcb8fabe4bbd0684f3a`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
            const location = data[0];
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=e913dadffcdcddcb8fabe4bbd0684f3a`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();
            res.send(weatherData);
        } else {
            res.status(404).send({ error: 'Location not found' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch location data' });
    }
});

app.get('/commute', async (req, res) => {
    const startCity = req.query.startCity;
    const startState = req.query.startState;
    const endCity = req.query.endCity;
    const endState = req.query.endState;
    const commuteCacheKey = `${startCity}-${startState}-${endCity}-${endState}`;
    if (!commuteTimeCache[commuteCacheKey]) {
        commuteTimeCache[commuteCacheKey] = '1 hour';
    }
    res.send({ commuteTime: commuteTimeCache[commuteCacheKey] });
});

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const commuteTimeCache = {};
