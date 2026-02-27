class WeatherApp {
  constructor() {
    this.apiKey = "20c8844b8602170d479d75794e374d55";
    this.searchInput = document.getElementById("search-input");
    this.searchBtn = document.getElementById("search-btn");
    this.weatherContainer = document.getElementById("weather-container");
  }

  init() {
    this.searchBtn.addEventListener("click", () => {
      const city = this.searchInput.value.trim();
      if (city) {
        this.getWeather(city);
      }
    });
  }

  async getWeather(city) {
    try {
      this.weatherContainer.innerHTML = "<p>Loading...</p>";

      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`)
      ]);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("City not found");
      }

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      this.displayWeather(weatherData);
      this.displayForecast(forecastData.list);

    } catch (error) {
      this.weatherContainer.innerHTML = "<p>City not found ❌</p>";
    }
  }

  displayWeather(data) {
    this.weatherContainer.innerHTML = `
      <div class="current-weather">
        <h2>${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
        <p><strong>${Math.round(data.main.temp)}°C</strong></p>
        <p>${data.weather[0].description}</p>
      </div>
      <div class="forecast-container"></div>
    `;
  }

  displayForecast(list) {
    const forecastContainer = document.querySelector(".forecast-container");

    const filtered = list.filter(item =>
      item.dt_txt.includes("12:00:00")
    ).slice(0, 5);

    filtered.forEach(day => {
      forecastContainer.innerHTML += `
        <div class="forecast-card">
          <h3>${new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "long" })}</h3>
          <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
          <p>${Math.round(day.main.temp)}°C</p>
          <p>${day.weather[0].description}</p>
        </div>
      `;
    });
  }
}

const app = new WeatherApp();
app.init();