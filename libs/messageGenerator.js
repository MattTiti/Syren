import axios from "axios";
import { capitalizeFirstLetter } from "@/lib/utils";
export async function generateDailyMessage(customization) {
  let message = "";

  if (customization.intro.text) {
    message += `${customization.intro.text}\n\n`;
  }

  if (customization.news.enabled) {
    const newsData = await fetchNews(customization.news.topic);
    message += `Today in ${capitalizeFirstLetter(
      customization.news.topic
    )}:\n${newsData}\n\n`;
  }

  if (customization.weather.enabled) {
    const weatherData = await fetchWeather(customization.weather);
    if (customization.weather.city) {
      message += `Weather in ${customization.weather.city}:\n${weatherData}\n\n`;
    } else {
      message += `Weather:\n${weatherData}\n\n`;
    }
  }

  if (customization.sports.enabled && customization.sports.team) {
    const sportsData = await fetchSports(customization.sports);
    if (sportsData) {
      message += `${customization.sports.teamName} updates:\n${sportsData}\n\n`;
    }
  }

  if (customization.events.enabled) {
    const eventsData = await fetchEvents(customization.events.country);
    message += `Today in ${customization.events.country}:\n${eventsData}\n\n`;
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

  // Filter out articles with "[Removed]" title
  const filteredArticles = articles.filter(
    (article) => article.title !== "[Removed]"
  );

  const headlines = await Promise.all(
    filteredArticles.slice(0, 3).map(async (article) => {
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

async function fetchEvents(country) {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed
  const year = today.getFullYear();

  const response = await axios.get(
    `https://goodmornin.app/api/events?day=${day}&month=${month}&year=${year}&country=${country}`
  );

  if (response.data && response.data.length > 0) {
    return response.data
      .slice(0, 3)
      .map((event) => event.name)
      .join("\n");
  } else {
    return "No notable events today.";
  }
}

async function fetchQuote() {
  const response = await axios.get("https://goodmornin.app/api/quotes");
  return `"${response.data.quote}" - ${response.data.author}`;
}

function degreesToDirection(degrees) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round((degrees % 360) / 22.5);
  return directions[index % 16];
}

function formatWeatherData(data, config) {
  const tempUnit = config.units === "imperial" ? "°F" : "°C";
  const speedUnit = config.units === "imperial" ? "mph" : "m/s";
  let result = "";

  if (data.summary) {
    result += `Summary: ${data.summary}\n`;
  }

  result += `Temperature: ${data.temperature}${tempUnit} (${data.minTemp}${tempUnit} - ${data.maxTemp}${tempUnit}), feels like ${data.feelsLike}${tempUnit}`;

  if (config.showWind)
    result += `\nWind: ${data.windSpeed} ${speedUnit} from ${degreesToDirection(
      data.windDirection
    )} ${data.windGust ? `(Gusts up to ${data.windGust}${speedUnit})` : ""}`;
  if (config.showRain && data.rain)
    result += `\nChance of rain: ${(data.rain * 100).toFixed(0)}%`;
  if (config.showHumidity && data.humidity)
    result += `\nHumidity: ${data.humidity}%`;

  return result.trim();
}

async function fetchSports(sportsConfig) {
  let sportsData = "";

  if (sportsConfig.showPreviousGame) {
    const lastGameResponse = await axios.get(
      `https://goodmornin.app/api/lastGame?teamId=${sportsConfig.teamId}`
    );
    const lastGame = lastGameResponse.data;
    sportsData += `Last game: ${lastGame.homeTeam} ${lastGame.homeScore} - ${lastGame.awayTeam} ${lastGame.awayScore} (${lastGame.date})\n`;
  }

  if (sportsConfig.showNextGame) {
    const nextGameResponse = await axios.get(
      `https://goodmornin.app/api/nextGame?teamId=${sportsConfig.teamId}`
    );
    const nextGame = nextGameResponse.data;
    sportsData += `Next game: ${nextGame.event} (${nextGame.date})`;
  }

  return sportsData.trim();
}
