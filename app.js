// Your OpenWeatherMap API Key
const API_KEY = 'cc44acb932d869af40e992a8ced665ad';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
function getWeather(city) {
    // Build the complete URL
    const url = ${API_URL}?q=${city}&appid=${API_KEY}&units=metric;
    
    // Make API call using Axios
    axios.get(url)
        .then(function(response) {
            // Success! We got the data
            console.log('Weather Data:', response.data);
            displayWeather(response.data);
        })
        .catch(function(error) {
            // Something went wrong
            console.error('Error fetching weather:', error);
            document.getElementById('weather-display').innerHTML = 
                '<p class="loading">Could not fetch weather data. Please try again.</p>';
        });
}

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;
}

// Call the function when page loads
getWeather('London');
const apiKey = "cc44acb932d869af40e992a8ced665ad";
const weatherContainer = document.getElementById("weatherContainer");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

async function getWeather(city) {
    try {
        showLoading();

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);

        displayWeather(response.data);

    } catch (error) {
        showError("City not found. Please try again.");
    }
}

function displayWeather(data) {
    weatherContainer.innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.main.temp}°C</p>
        <p>${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    `;
}

function showError(message) {
    weatherContainer.innerHTML = `
        <div class="error">
            <p>${message}</p>
        </div>
    `;
}

function showLoading() {
    weatherContainer.innerHTML = `
        <div class="spinner"></div>
    `;
}
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});
function WeatherApp() {
    this.apiKey = "cc44acb932d869af40e992a8ced665ad";

    // Cache DOM elements once
    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.weatherContainer = document.getElementById("weatherContainer");
}

WeatherApp.prototype.init = function () {
    this.showWelcome();

    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });
};
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = "";
};
WeatherApp.prototype.getWeather = async function (city) {
    try {
        this.showLoading();

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

        const [weatherRes, forecastRes] = await Promise.all([
            axios.get(weatherURL),
            axios.get(forecastURL)
        ]);

        this.displayWeather(weatherRes.data);
        this.displayForecast(forecastRes.data);

    } catch (error) {
        this.showError("City not found.");
    }
};
WeatherApp.prototype.processForecastData = function (data) {
    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyData.slice(0, 5);
};
WeatherApp.prototype.displayForecast = function (data) {
    const forecastData = this.processForecastData(data);

    let forecastHTML = <div class="forecast-grid">;

    forecastData.forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        forecastHTML += `
            <div class="forecast-card">
                <h3>${dayName}</h3>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
                <p>${day.main.temp}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });

    forecastHTML += </div>;

    this.weatherContainer.innerHTML += forecastHTML;
};
const app = new WeatherApp();
app.init();
