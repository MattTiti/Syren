import axios from "axios";

export async function generateDailyMessage(customization) {
  let message = "";

  if (customization.intro.text) {
    message += `${customization.intro.text}\n\n`;
  }

  if (customization.news.enabled) {
    const newsData = await fetchNews(customization.news.topic);
    message += `Today's top ${customization.news.topic} headlines:\n${newsData}\n\n`;
  }

  if (customization.weather.enabled) {
    const weatherData = await fetchWeather(customization.weather);
    message += `Weather:\n${weatherData}\n\n`;
  }

  if (customization.sports.enabled && customization.sports.team) {
    const sportsData = await fetchSports(customization.sports);
    message += `Sports updates:\n${sportsData}\n\n`;
  }

  if (customization.events.enabled) {
    const eventsData = await fetchEvents(customization.events.country);
    message += `Today's events:\n${eventsData}\n\n`;
  }

  if (customization.quotes.enabled) {
    const quoteData = await fetchQuote();
    message += `Quote of the day:\n${quoteData}\n\n`;
  }

  if (customization.conclusion.text) {
    message += customization.conclusion.text;
  }

  return message.trim();
}

async function fetchNews(topic) {
  const response = await axios.get(
    `https://goodmornin.app/api/news?topic=${topic}`
  );
  const headlines =
    response.data.articles?.map((article) => article.title) || [];
  return headlines.join("\n");
}

async function fetchWeather(weatherConfig) {
  const params =
    weatherConfig.inputType === "city"
      ? { city: weatherConfig.city }
      : { lat: weatherConfig.latitude, lon: weatherConfig.longitude };
  const response = await axios.get("https://goodmornin.app/api/weather", {
    params,
  });
  return formatWeatherData(response.data, weatherConfig);
}

async function fetchSports(sportsConfig) {
  const response = await axios.get(
    `https://goodmornin.app/api/sports?league=${sportsConfig.league}&team=${sportsConfig.team}`
  );
  return formatSportsData(response.data, sportsConfig);
}

async function fetchEvents(country) {
  const response = await axios.get(
    `https://goodmornin.app/api/events?country=${country}`
  );
  return response.data.events.join("\n");
}

async function fetchQuote() {
  const response = await axios.get("https://goodmornin.app/api/quotes");
  return `"${response.data.quote}" - ${response.data.author}`;
}

function formatWeatherData(data, config) {
  let result = `Temperature: ${data.temperature}°F, feels like ${data.feelsLike}°F (${data.low}°F - ${data.high}°F)`;
  if (config.showWind)
    result += `\nWind: ${data.windSpeed} mph from the ${data.windDirection}`;
  if (config.showRain) result += `\nRain: ${data.rainChance}%`;
  if (config.showHumidity) result += `\nHumidity: ${data.humidity}%`;
  return result;
}

function formatSportsData(data, config) {
  let result = "";
  if (config.showPreviousGame && data.previousGame) {
    result += `Previous game: ${data.previousGame.score}\n`;
  }
  if (config.showNextGame && data.nextGame) {
    result += `Next game: ${data.nextGame.date} vs ${data.nextGame.opponent}`;
  }
  return result;
}
