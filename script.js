
const apiKey = "1ec1a8428fecd108f63c14503def4e42"; // your API key
const weatherContainer = document.getElementById("weather-container");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

// Handle search on button click or Enter key
searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  searchCity();
});

cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchCity();
  }
});

function searchCity() {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeatherData(city);
  } else {
    weatherContainer.innerHTML = `<p class="error">⚠️ Please enter a city name.</p>`;
  }
}

async function getWeatherData(city) {
  try {
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      weatherContainer.innerHTML = `<p class="error">❌ City not found. Try another.</p>`;
      return;
    }

    const { lat, lon } = geoData[0];
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok || !weatherData.main) {
      weatherContainer.innerHTML = `<p class="error">⚠️ Unable to fetch weather. Try again.</p>`;
      return;
    }

    displayWeather(weatherData);
    changeBackground(weatherData.weather[0].main);
  } catch (error) {
    console.error("Error fetching weather:", error);
    weatherContainer.innerHTML = `<p class="error">⚠️ Something went wrong. Check the console.</p>`;
  }
}

function displayWeather(data) {
  const {
    name = "Unknown",
    main: { temp = "N/A", humidity = "N/A" },
    weather = [{ description: "N/A", icon: "01d" }],
    wind: { speed = "N/A" } = {},
  } = data;

  weatherContainer.innerHTML = `
    <div class="weather-card">
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
      <p class="temp">${temp}°C</p>
      <p class="desc">${weather[0].description}</p>
      <p>💨 Wind: ${speed} m/s</p>
      <p>💧 Humidity: ${humidity}%</p>
    </div>
  `;
}

//  Dynamic background color change based on weather type
function changeBackground(condition) {
  const body = document.body;
  switch (condition.toLowerCase()) {
    case "clear":
      body.style.background = "linear-gradient(135deg, #f9d423, #ff4e50)";
      break;
    case "clouds":
      body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      break;
    case "rain":
    case "drizzle":
      body.style.background = "linear-gradient(135deg, #74ebd5, #ACB6E5)";
      break;
    case "thunderstorm":
      body.style.background = "linear-gradient(135deg, #232526, #414345)";
      break;
    case "snow":
      body.style.background = "linear-gradient(135deg, #83a4d4, #b6fbff)";
      break;
    default:
      body.style.background = "linear-gradient(135deg, #74b9ff, #a29bfe)";
  }
}
