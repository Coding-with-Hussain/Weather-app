const API_KEY = 'affdb8a9b12a4b999df121251252404';
const BASE_URL = 'http://api.weatherapi.com/v1/current.json';
const SEARCH_URL = 'http://api.weatherapi.com/v1/search.json';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const condition = document.getElementById('condition');
const feelsLike = document.getElementById('feels-like');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const suggestionsList = document.getElementById('suggestions-list');

// Format date
function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Fetch search suggestions
async function getSearchSuggestions(query) {
    try {
        const response = await fetch(`${SEARCH_URL}?key=${API_KEY}&q=${query}`);
        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

// Show suggestions
function showSuggestions(suggestions) {
    suggestionsList.innerHTML = '';
    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = `${suggestion.name}, ${suggestion.country}`;
            li.addEventListener('click', () => {
                cityInput.value = suggestion.name;
                suggestionsList.classList.remove('show');
                getWeatherData(suggestion.name);
            });
            suggestionsList.appendChild(li);
        });
        suggestionsList.classList.add('show');
    } else {
        suggestionsList.classList.remove('show');
    }
}

// Fetch weather data
async function getWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&aqi=no`);
        const data = await response.json();
        
        if (response.ok) {
            updateUI(data);
        } else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
        console.error('Error:', error);
    }
}

// Update UI with weather data
function updateUI(data) {
    const { location, current } = data;
    
    cityName.textContent = `${location.name}, ${location.country}`;
    date.textContent = formatDate(location.localtime);
    temp.textContent = `${current.temp_c}°C`;
    condition.textContent = current.condition.text;
    feelsLike.textContent = `Feels like: ${current.feelslike_c}°C`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    humidity.textContent = `${current.humidity}%`;
    pressure.textContent = `${current.pressure_mb} hPa`;
    visibility.textContent = `${current.vis_km} km`;
}

// Event Listeners
cityInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length >= 2) {
        const suggestions = await getSearchSuggestions(query);
        showSuggestions(suggestions);
    } else {
        suggestionsList.classList.remove('show');
    }
});

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        suggestionsList.classList.remove('show');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
            suggestionsList.classList.remove('show');
        }
    }
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!cityInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.classList.remove('show');
    }
});

// Initial load with default city
getWeatherData('London'); 
getWeatherData('London'); 