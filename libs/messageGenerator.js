import axios from "axios";
import { capitalizeFirstLetter } from "@/lib/utils";

function replaceNonGSM7Chars(text) {
  const replacements = {
    "“": '"', // Left double quotation mark
    "”": '"', // Right double quotation mark
    "‘": "'", // Left single quotation mark
    "’": "'", // Right single quotation mark
    "–": "-", // En-dash
    "—": "-", // Em-dash
    "…": "...", // Ellipsis
    "`": "'", // Backtick to apostrophe
  };

  return text.replace(/[“”‘’–—…`]/g, (char) => replacements[char] || char);
}

async function fetchRandomFact() {
  try {
    const response = await axios.get("https://goodmornin.app/api/facts");
    return response.data.fact;
  } catch (error) {
    console.error("Error fetching random fact:", error);
    return "Unable to fetch a random fact at this time.";
  }
}

export async function generateDailyMessage(customization) {
  let message = "";

  if (customization.intro.text) {
    message += `${customization.intro.text}\n\n`;
  }

  if (customization.news.enabled) {
    let newsData;
    if (customization.news.type === "topHeadlines") {
      newsData = await fetchTopHeadlines(customization.news.topic);
      message += `${capitalizeFirstLetter(
        customization.news.topic
      )} News:\n${newsData}\n\n`;
    } else if (customization.news.type === "customSearch") {
      newsData = await fetchCustomNews(customization.news.customQuery);
      message += `${customization.news.customQuery} News:\n${newsData}\n\n`;
    }
  }

  if (customization.weather.enabled) {
    const weatherData = await fetchWeather(customization.weather);
    if (customization.weather.city) {
      message += `Weather in ${customization.weather.city}:\n${weatherData}\n\n`;
    } else {
      message += `Weather:\n${weatherData}\n\n`;
    }
  }

  if (customization.sports.enabled && customization.sports.teamId) {
    const sportsData = await fetchSports(customization.sports);
    if (sportsData) {
      message += `${customization.sports.teamName} updates:\n${sportsData}\n\n`;
    }
  }

  if (customization.events.enabled) {
    const eventsData = await fetchEvents(customization.events.country);
    message += `${customization.events.country} Holidays:\n${eventsData}\n\n`;
  }

  if (customization.onThisDay && customization.onThisDay.enabled) {
    const onThisDayData = await fetchOnThisDay();
    if (onThisDayData) {
      message += `On This Day in History:\n${onThisDayData}\n\n`;
    } else {
      console.log("No events available to add to message");
    }
  }

  if (customization.randomFact && customization.randomFact.enabled) {
    const randomFactData = await fetchRandomFact();
    message += `Fun Fact:\n${randomFactData}\n\n`;
  }

  if (customization.horoscope.enabled && customization.horoscope.sign) {
    const horoscopeData = await fetchHoroscope(customization.horoscope.sign);
    message += `Horoscope:\n${horoscopeData}\n\n`;
  }

  if (customization.quotes.enabled) {
    const quoteData = await fetchQuote();
    message += `Quote of the day:\n${quoteData}\n\n`;
  }

  if (customization.conclusion.text) {
    message += customization.conclusion.text;
  }

  // After building the message, replace non-GSM-7 characters
  message = replaceNonGSM7Chars(message);

  return message.trim();
}

export async function generateDailyEmailMessage(customization) {
  let message =
    "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #404040;'>";

  if (customization.intro.text) {
    message += `<p>${customization.intro.text}</p>`;
  }

  if (customization.news.enabled) {
    let newsData;
    if (customization.news.type === "topHeadlines") {
      newsData = await fetchTopHeadlines(customization.news.topic);
      message += `<h3 style='color: #404040; font-size: 16px;'><strong>${capitalizeFirstLetter(
        customization.news.topic
      )} News:</strong></h3>`;
    } else if (customization.news.type === "customSearch") {
      newsData = await fetchCustomNews(customization.news.customQuery);
      message += `<h3 style='color: #404040; font-size: 16px;'><strong>${customization.news.customQuery} News:</strong></h3>`;
    }
    message += `<ul style='padding-left: 20px;'>${newsData
      .replace(/\*/g, "<li>")
      .replace(/\n/g, "</li>")}</ul>`;
  }

  if (customization.weather.enabled) {
    const weatherData = await fetchWeather(customization.weather);
    message += `<h3 style='color: #404040; font-size: 16px;'><strong>Weather${
      customization.weather.city ? ` in ${customization.weather.city}` : ""
    }:</strong></h3>`;
    message += `<p>${weatherData.replace(/\n/g, "<br>")}</p>`;
  }

  if (customization.sports.enabled && customization.sports.teamId) {
    const sportsData = await fetchSports(customization.sports);
    if (sportsData) {
      message += `<h3 style='color: #404040; font-size: 16px;'><strong>${customization.sports.teamName} updates:</strong></h3>`;
      message += `<p>${sportsData.replace(/\n/g, "<br>")}</p>`;
    }
  }

  if (customization.events.enabled) {
    const eventsData = await fetchEvents(customization.events.country);
    message += `<h3 style='color: #404040; font-size: 16px;'><strong>${customization.events.country} Holidays:</strong></h3>`;
    message += `<ul style='padding-left: 20px;'>${eventsData
      .replace(/\*/g, "<li>")
      .replace(/\n/g, "</li>")}</ul>`;
  }

  if (customization.onThisDay && customization.onThisDay.enabled) {
    const onThisDayData = await fetchOnThisDay();
    if (onThisDayData) {
      message += `<h3 style='color: #404040; font-size: 16px;'><strong>On This Day in History:</strong></h3>`;
      message += `<p>${onThisDayData.replace(/\n/g, "<br>")}</p>`;
    }
  }

  if (customization.randomFact && customization.randomFact.enabled) {
    const randomFactData = await fetchRandomFact();
    message += `<h3 style='color: #404040; font-size: 16px;'><strong>Fun Fact:</strong></h3>`;
    message += `<p>${randomFactData}</p>`;
  }

  if (customization.horoscope.enabled && customization.horoscope.sign) {
    const horoscopeData = await fetchHoroscope(customization.horoscope.sign);
    message += `<h3 style='color: #404040; font-size: 16px;'><strong>Horoscope:</strong></h3>`;
    message += `<p>${horoscopeData}</p>`;
  }

  if (customization.quotes.enabled) {
    const quoteData = await fetchQuote();
    message += `<h3 style='color: #404040; font-size: 16px;'><strong>Quote of the day:</strong></h3>`;
    message += `<p><em>"${quoteData.split('" - ')[0]}"</em> - ${
      quoteData.split('" - ')[1]
    }</p>`;
  }

  if (customization.conclusion.text) {
    message += `<p>${customization.conclusion.text}</p>`;
  }

  message += "</div>";

  return message;
}

async function fetchTopHeadlines(topic) {
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
      return `* ${article.title} ${shortUrl}`;
    })
  );
  return headlines.join("\n");
}

async function fetchCustomNews(query) {
  const response = await axios.get(
    `https://goodmornin.app/api/customNews?q=${encodeURIComponent(query)}`
  );
  const articles = response.data.articles || [];

  // Filter out articles with "[Removed]" title
  const filteredArticles = articles.filter(
    (article) => article.title !== "[Removed]"
  );

  const headlines = await Promise.all(
    filteredArticles.slice(0, 3).map(async (article) => {
      const shortUrl = await shortenUrl(article.url);
      return `* ${article.title} ${shortUrl}`;
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
      .map((event) => `* ${event.name}`)
      .join("\n");
  } else {
    return "No notable events today.";
  }
}

async function fetchQuote() {
  const response = await axios.get("https://goodmornin.app/api/quotes");
  return `"${response.data.quote}" - ${response.data.author}`;
}

async function fetchHoroscope(sign) {
  try {
    const response = await axios.get(
      `https://goodmornin.app/api/horoscope?sign=${sign}`
    );
    return response.data.horoscope;
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return "Unable to fetch horoscope at this time.";
  }
}

async function fetchOnThisDay() {
  try {
    const response = await axios.get("https://goodmornin.app/api/history");
    console.log("On This Day API response:", response.data);
    if (
      response.data &&
      response.data.events &&
      response.data.events.length > 0
    ) {
      return response.data.events
        .map((event) => `${event.year}: ${event.text}`)
        .join("\n");
    } else {
      console.log("No On This Day events received");
      return null;
    }
  } catch (error) {
    console.error("Error fetching On This Day events:", error);
    return null;
  }
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
  const tempUnit = config.units === "imperial" ? "F" : "C";
  const speedUnit = config.units === "imperial" ? "mph" : "m/s";
  let result = "";

  if (data.summary) {
    result += `* ${data.summary}\n`;
  }

  result += `* ${data.temperature}${tempUnit} (${data.minTemp}${tempUnit} - ${data.maxTemp}${tempUnit}), feels like ${data.feelsLike}${tempUnit}`;

  if (config.showWind)
    result += `\n* ${
      data.windSpeed
    } ${speedUnit} winds from ${degreesToDirection(data.windDirection)} ${
      data.windGust ? `(Gusts up to ${data.windGust}${speedUnit})` : ""
    }`;
  if (config.showRain && data.rain)
    result += `\n* ${(data.rain * 100).toFixed(0)}% chance of rain`;
  if (config.showHumidity && data.humidity)
    result += `\n* ${data.humidity}% humidity`;

  return result.trim();
}

async function fetchSports(sportsConfig) {
  let sportsData = "";

  if (sportsConfig.showPreviousGame) {
    const lastGameResponse = await axios.get(
      `https://goodmornin.app/api/lastGame?teamId=${sportsConfig.teamId}`
    );
    const lastGame = lastGameResponse.data;
    sportsData += `* Last game: ${lastGame.homeTeam} ${lastGame.homeScore} - ${lastGame.awayTeam} ${lastGame.awayScore} (${lastGame.date})\n`;
  }

  if (sportsConfig.showNextGame) {
    const nextGameResponse = await axios.get(
      `https://goodmornin.app/api/nextGame?teamId=${sportsConfig.teamId}`
    );
    const nextGame = nextGameResponse.data;
    sportsData += `* Next game: ${nextGame.event} (${nextGame.date})`;
  }

  return sportsData.trim();
}
