const CITY_NOT_FOUND = "404";
const FORECAST_TIME = "12:00:00";
const weatherApi = "6293bcf1e16f4a9aff35282648cbef09";
const locationElement = document.getElementById("location");
const tempElement = document.getElementById("today-temp");
const condElement = document.getElementById("today-cond");
const aqiElement = document.getElementById("aqi");
const iconElement = document.getElementById("weather-icon");
function showLoadingState() {
  locationElement.textContent = `Fetching Weather...`;
  tempElement.textContent = `---`;
  condElement.textContent = `Loading...`;
  aqiElement.textContent = `Loading AQI...`;
  iconElement.style.display = "none";
}
function showCityNotFoundState() {
  locationElement.textContent = `City Not Found`;
  tempElement.textContent = `...`;
  aqiElement.textContent = `...`;
  condElement.textContent = `...`;
  iconElement.style.display = "none";
}
function updateElementText(element, message) {
  element.textContent = `${message}`;
}
async function getWeatherData(locationQuery) {
  showLoadingState();
  try {
    const weatherData = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${locationQuery}&appid=${weatherApi}&units=metric`,
    );
    const data = await weatherData.json();
    if (data.cod === CITY_NOT_FOUND) {
      showCityNotFoundState();
      return;
    }
    getAirQuality(data.coord.lat, data.coord.lon);
    locationElement.textContent = data.name;
    tempElement.textContent = `${data.main.temp}°C`;
    condElement.textContent = data.weather[0].description;
    iconElement.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    iconElement.style.display = "";
  } catch (error) {
    updateElementText(locationElement, "Failed to load Data...");
    console.error(error);
  }
}
async function getAirQuality(lat, lon) {
  try {
    const airQuality = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${weatherApi}`,
    );
    const dataAqi = await airQuality.json();
    function getAqiLabels(aqi) {
      const labels = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor",
      };
      return labels[aqi];
    }
    const aqiValue = dataAqi.list[0].main.aqi;
    aqiElement.textContent = `AQI: ${getAqiLabels(aqiValue)}`;
  } catch (error) {
    console.error(error);
    updateElementText(aqiElement, "Issues in loading AQI... ");
  }
}
let grouped = {};
const forecastHeading = document.getElementById("forecast-heading");
async function getWeeklyForecast(locationQuery) {
  updateElementText(forecastHeading, "Fetching Weekly Forecast...");
  const container = document.querySelector(".container");
  container.innerHTML = "";
  try {
    const weeklyData = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?${locationQuery}&appid=${weatherApi}&units=metric`,
    );
    const weeklyForecast = await weeklyData.json();
    if (weeklyForecast.cod === CITY_NOT_FOUND) {
      updateElementText(forecastHeading, "City Not Found");
      container.innerHTML = "No Forecast Data Available";
      return;
    }
    const dailyForecast = weeklyForecast.list.filter((item) => {
      return item.dt_txt.includes(FORECAST_TIME);
    });
    const days = {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    };
    let cardsHTML = "";
    for (const item of dailyForecast) {
      const date = item.dt_txt.split(" ")[0];
      const forecastDate = new Date(date);
      const dayName = days[forecastDate.getDay()];
      const temp = item.main.temp.toFixed(0);
      const weather = item.weather[0];
      const icon = weather.icon;
      const condition = weather.description;
      cardsHTML += `
      <div class="next-day">
      <p>${dayName}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon">
      <p>${temp}°C</p>
      <p>${condition}</p>
      </div>
      `;
    }
    container.innerHTML = cardsHTML;
    updateElementText(forecastHeading, "Weekly Forecast");

    grouped = {};
    for (const item of weeklyForecast.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    }
  } catch (error) {
    console.error(error);
    container.innerHTML = `Failed to load Weekly Predictions... `;
    updateElementText(forecastHeading, "Failed to load Weekly Predictions... ");
  }
}
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      getWeatherData(`lat=${latitude}&lon=${longitude}`);
      getWeeklyForecast(`lat=${latitude}&lon=${longitude}`);
    },
    (error) => {
      console.error(error);
      updateElementText(
        locationElement,
        "Location access denied. Please search for your city above.",
      );
    },
  );
}
const weekDetailsContainer = document.getElementById("week-details-container");
document
  .getElementById("week-details-btn")
  .addEventListener("click", (event) => {
    event.preventDefault();
    if (weekDetailsContainer.innerHTML !== "") {
      weekDetailsContainer.innerHTML = "";
      return;
    }
    let detailsHTML = "";
    for (const date of Object.keys(grouped)) {
      const forecastDate = new Date(date);
      const formattedDate = forecastDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      detailsHTML += `
      <h4>${formattedDate}</h4>
      `;
      for (const item of grouped[date]) {
        const time = item.dt_txt.split(" ")[1].slice(0, 5);
        const temp = item.main.temp.toFixed(0);
        const condition = item.weather[0].description;
        const icon = item.weather[0].icon;
        detailsHTML += `
        <div class="hour-row">
        <p>${time}</p>
        <p>${temp}°C</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather-icon">
        <p>${condition}</p>
        </div>
        `;
      }
    }
    weekDetailsContainer.innerHTML = detailsHTML;
  });
document.getElementById("search-btn").addEventListener("click", () => {
  handleSearch();
});
const searchElement = document.getElementById("search");
searchElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearch();
  }
});
const SEARCH_HISTORY_KEY = "searchHistory";
function saveSearchHistory(cityName) {
  const normalisedCity = cityName.toLowerCase();
  const searchHistory =
    JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
  const cityExists = searchHistory.some(
    (city) => city.toLowerCase() === normalisedCity,
  );
  if (!cityExists) {
    searchHistory.push(cityName);
  }
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
}
const forecastContainer = document.querySelector(".container");
function showEmptySearchState() {
  locationElement.textContent = `Please enter a city name`;
  tempElement.textContent = `...`;
  aqiElement.textContent = `...`;
  condElement.textContent = `...`;
  iconElement.style.display = "none";
  forecastHeading.textContent = `...`;
  forecastContainer.innerHTML = "";
}

function handleSearch() {
  const cityName = searchElement.value.trim();
  if (!cityName) {
    showEmptySearchState();
    return;
  }
  weekDetailsContainer.innerHTML = "";
  getWeatherData(`q=${cityName}`);
  getWeeklyForecast(`q=${cityName}`);
  saveSearchHistory(cityName);
  renderSearchHistory();
}
const body = document.body;
const themeIcon = document.getElementById("theme-icon");
const THEME_KEY = "theme";
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "dark") {
  body.classList.add("dark");
  themeIcon.classList.remove("fa-moon");
  themeIcon.classList.add("fa-sun");
}
document.getElementById("dark-mode").addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    themeIcon.classList.remove("fa-sun");
    themeIcon.classList.add("fa-moon");
    localStorage.setItem(THEME_KEY, "light");
  }
});
function renderSearchHistory() {
  const searchHistory =
    JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
  const ul = document.getElementById("search-history");
  ul.innerHTML = "";
  for (const city of searchHistory) {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      searchElement.value = city;
      ul.style.display = "none";
      handleSearch();
    });
    ul.appendChild(li);
  }
}
const ul = document.getElementById("search-history");
searchElement.addEventListener("click", (event) => {
  const searchHistory =
    JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
  if (searchHistory.length > 0) {
    ul.style.display = "block";
  }
});
const searchWrapper = document.querySelector(".search-wrapper");
document.addEventListener("click", (event) => {
  if (!searchWrapper.contains(event.target)) {
    ul.style.display = "none";
  }
});
const menuBtn = document.getElementById("menu-btn");
const nav = document.querySelector("nav");
const overlay = document.getElementById("overlay");
menuBtn.addEventListener("click", () => {
  nav.classList.toggle("nav-open");
  if (nav.classList.contains("nav-open")) {
    overlay.classList.add("overlay-open");
  } else {
    overlay.classList.remove("overlay-open");
  }
});
overlay.addEventListener("click", () => {
  nav.classList.remove("nav-open");
  overlay.classList.remove("overlay-open");
});
let newsData = [];
const newsContainer = document.getElementById("news-container");
function renderNews(articles) {
  let newsHTML = "";
  for (const article of articles) {
    const newsDescription = article.description || `No Description Available`;
    const newsImage = article.image;
    const newsTitle = article.title;
    if (!newsImage) {
      continue;
    }
    newsHTML += ` 
                  <div class="news-card">
                    <img src="${newsImage}" alt="">
                    <h3>${newsTitle}</h3>
                    <p class="news-description">${newsDescription}</p>
                    <a href="${article.url}" target="_blank">
                      Read More
                    </a>
                  </div>`;
  }
  newsContainer.innerHTML = newsHTML;
}
const climateApi = "5066e23f5c821a9c84ed54bbfccdb7f1";
async function fetchNews() {
  try {
    const news = await fetch(
      `https://gnews.io/api/v4/search?q=climate&apikey=${climateApi}`,
    );
    if (!news.ok) {
      throw new Error("Failed to Fetch...");
    }
    const newsDetails = await news.json();
    newsData = newsDetails.articles;
    renderNews(newsData);
  } catch (error) {
    console.error(error);
    newsContainer.innerHTML = `<p>Failed to load news...</p>`;
  }
}
const newsBtn = document.getElementById("news-btn");
newsBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (newsContainer.innerHTML !== "") {
    newsContainer.innerHTML = "";
    return;
  }
  if (newsData.length === 0) {
    fetchNews();
  } else {
    renderNews(newsData);
  }
});
function init() {
  const now = new Date();
  document.getElementById("today-day").textContent = now.toLocaleDateString(
    "en-IN",
    { weekday: "long" },
  );
  document.getElementById("today-date").textContent = now.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
  getLocation();
  renderSearchHistory();
}
init();
