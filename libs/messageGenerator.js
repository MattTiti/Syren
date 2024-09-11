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
    `https://goodmornin.app/api/news?category=${topic}`
  );
  const articles = response.data.articles || [];
  const headlines = await Promise.all(
    articles.slice(0, 3).map(async (article) => {
      const shortUrl = await shortenUrl(article.url);
      return `${article.title} ${shortUrl}`;
    })
  );
  return headlines.join("\n");
}

async function shortenUrl(url) {
  try {
    const response = await axios.post("https://goodmornin.app/api/shorten", {
      url,
    });
    return response.data.shortUrl;
  } catch (error) {
    console.error("Error shortening URL:", error);
    return url; // Return original URL if shortening fails
  }
}

async function fetchWeather(weatherConfig) {
  const params = {
    lat: weatherConfig.latitude,
    lon: weatherConfig.longitude,
    units: weatherConfig.units,
  };
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
  const tempUnit = config.units === "imperial" ? "°F" : "°C";
  const speedUnit = config.units === "imperial" ? "mph" : "m/s";

  let result = `Temperature: ${data.temperature}${tempUnit}, feels like ${data.feelsLike}${tempUnit}`;
  result += `\nToday's forecast: High of ${data.maxTemp}${tempUnit}, Low of ${data.minTemp}${tempUnit}`;

  if (config.showWind)
    result += `\nWind: ${data.windSpeed} ${speedUnit} from ${data.windDirection}°`;
  if (config.showRain && data.rain)
    result += `\nChance of rain: ${(data.rain * 100).toFixed(0)}%`;
  if (config.showHumidity && data.humidity)
    result += `\nHumidity: ${data.humidity}%`;

  if (data.summary) {
    result += `\n\nSummary: ${data.summary}`;
  }

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
