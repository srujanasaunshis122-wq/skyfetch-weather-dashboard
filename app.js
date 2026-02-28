class WeatherApp {
  constructor() {
    this.apiKey = "cc44acb932d869af40e992a8ced665ad"; // 🔥 Replace this

    // DOM Elements
    this.searchInput = document.getElementById("search-input");
    this.searchBtn = document.getElementById("search-btn");
    this.weatherContainer = document.getElementById("weather-container");

    this.recentSearchesSection = document.getElementById("recent-searches-section");
    this.recentSearchesContainer = document.getElementById("recent-searches-container");
    this.clearHistoryBtn = document.getElementById("clear-history-btn");

    // Load stored searches
    this.recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    this.init();
  }

  init() {
    this.searchBtn.addEventListener("click", () => {
      const city = this.searchInput.value.trim();
      if (city) {
        this.getWeather(city);
      }
    });

    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const city = this.searchInput.value.trim();
        if (city) {
          this.getWeather(city);
        }
      }
    });

    this.clearHistoryBtn.addEventListener("click", () => {
      this.clearHistory();
    });

    this.displayRecentSearches();
    this.loadLastCity();
  }

  async getWeather(city) {
    try {
      this.weatherContainer.innerHTML = "<p>Loading...</p>";

      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(weatherURL),
        fetch(forecastURL)
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("City not found");
      }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      this.displayWeather(weatherData);
      this.displayForecast(forecastData);

      this.saveRecentSearch(city);

    } catch (error) {
      this.weatherContainer.innerHTML = "<p>City not found ❌</p>";
    }
  }

  displayWeather(data) {
    const html = `
      <h2>${data.name}</h2>
      <p><strong>${Math.round(data.main.temp)}°C</strong></p>
      <p>${data.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
      <div id="forecast-container"></div>
    `;

    this.weatherContainer.innerHTML = html;
  }

  displayForecast(data) {
    const forecastContainer = document.getElementById("forecast-container");

    // Take one forecast per day (every 8th item)
    const dailyForecast = data.list.filter((item, index) => index % 8 === 0);

    let forecastHTML = "<h3>5-Day Forecast</h3><div class='forecast-grid'>";

    dailyForecast.forEach(day => {
      forecastHTML += `
        <div class="forecast-card">
          <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
          <p>${Math.round(day.main.temp)}°C</p>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
        </div>
      `;
    });

    forecastHTML += "</div>";

    forecastContainer.innerHTML = forecastHTML;
  }

  saveRecentSearch(city) {
    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    this.recentSearches = this.recentSearches.filter(c => c !== city);
    this.recentSearches.unshift(city);

    if (this.recentSearches.length > 5) {
      this.recentSearches.pop();
    }

    localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));
    localStorage.setItem("lastCity", city);

    this.displayRecentSearches();
  }

  displayRecentSearches() {
    if (this.recentSearches.length === 0) {
      this.recentSearchesSection.style.display = "none";
      return;
    }

    this.recentSearchesSection.style.display = "block";
    this.recentSearchesContainer.innerHTML = "";

    this.recentSearches.forEach(city => {
      const btn = document.createElement("button");
      btn.textContent = city;
      btn.classList.add("recent-search-btn");

      btn.addEventListener("click", () => {
        this.getWeather(city);
      });

      this.recentSearchesContainer.appendChild(btn);
    });
  }

  loadLastCity() {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      this.getWeather(lastCity);
    }
  }

  clearHistory() {
    localStorage.removeItem("recentSearches");
    localStorage.removeItem("lastCity");
    this.recentSearches = [];
    this.displayRecentSearches();
  }
}

// Initialize App
new WeatherApp();