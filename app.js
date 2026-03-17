const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherResult = document.getElementById("weather-result");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const description = document.getElementById("description");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const errorMsg = document.getElementById("error");

// Map Open-Meteo weather codes to description and emoji icon
const weatherMap = {
  0: { desc: "Clear sky", icon: "☀️" },
  1: { desc: "Mainly clear", icon: "🌤️" },
  2: { desc: "Partly cloudy", icon: "🌤️" },
  3: { desc: "Overcast", icon: "🌤️" },
  45: { desc: "Fog", icon: "🌫️" },
  48: { desc: "Depositing rime fog", icon: "🌫️" },
  51: { desc: "Light drizzle", icon: "🌦️" },
  53: { desc: "Moderate drizzle", icon: "🌦️" },
  55: { desc: "Dense drizzle", icon: "🌦️" },
  61: { desc: "Slight rain", icon: "🌧️" },
  63: { desc: "Moderate rain", icon: "🌧️" },
  65: { desc: "Heavy rain", icon: "🌧️" },
  66: { desc: "Light freezing rain", icon: "❄️🌧️" },
  67: { desc: "Heavy freezing rain", icon: "❄️🌧️" },
  71: { desc: "Slight snow", icon: "❄️" },
  73: { desc: "Moderate snow", icon: "❄️" },
  75: { desc: "Heavy snow", icon: "❄️" },
  80: { desc: "Rain showers", icon: "🌦️" },
  81: { desc: "Moderate rain showers", icon: "🌦️" },
  82: { desc: "Violent rain showers", icon: "🌦️" },
  95: { desc: "Thunderstorm", icon: "⛈️" },
  96: { desc: "Thunderstorm with slight hail", icon: "⛈️" },
  99: { desc: "Thunderstorm with heavy hail", icon: "⛈️" }
};

// Load last searched city
window.addEventListener("DOMContentLoaded", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWeather(lastCity);
    cityInput.value = lastCity;
  }
});

// Search button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) return alert("Please enter a city name!");
  getWeather(city);
});

// Press Enter to search
cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Main function to get weather
async function getWeather(city) {
  errorMsg.classList.add("hidden");
  weatherResult.classList.add("hidden");

  try {
    // 1️⃣ Get coordinates from place name using OpenStreetMap Nominatim
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json`
    );
    const geoData = await geoRes.json();
    if (!geoData.length) throw new Error("City not found");

    const { lat, lon, display_name } = geoData[0];

    // 2️⃣ Get weather from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    // 3️⃣ Map weathercode to description and icon
    const weatherInfo = weatherMap[current.weathercode] || { desc: "Unknown", icon: "❓" };

    // 4️⃣ Update UI
    cityName.textContent = display_name;
    weatherIcon.textContent = weatherInfo.icon;
    description.textContent = weatherInfo.desc;
    temperature.textContent = `${current.temperature.toFixed(1)} °C`;
    humidity.textContent = "N/A"; // Open-Meteo free API doesn't return humidity
    wind.textContent = `${current.windspeed} km/h`;

    weatherResult.classList.remove("hidden");

    // Save last searched city
    localStorage.setItem("lastCity", city);

  } catch (err) {
    errorMsg.textContent = err.message;
    errorMsg.classList.remove("hidden");
  }
}