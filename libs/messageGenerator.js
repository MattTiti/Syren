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
      message += `${capitalizeFirstLetter(customization.news.topic)} News:\n`;
    } else if (customization.news.type === "customSearch") {
      newsData = await fetchCustomNews(customization.news.customQuery);
      message += `${customization.news.customQuery} News:\n`;
    }

    for (const article of newsData) {
      message += `* ${article.title}`;
      if (customization.news.includeLinks) {
        const shortUrl = await shortenUrl(article.url);
        message += ` ${shortUrl}`;
      }
      message += "\n";
    }
    message += "\n";
  }

  if (customization.weather.enabled) {
    const weatherData = await fetchWeather(customization.weather);
    if (customization.weather.city) {
      message += `Weather in ${customization.weather.city}:\n${weatherData}\n\n`;
    } else {
      message += `Weather:\n${weatherData}\n\n`;
    }
  }

  if (customization.sports.enabled) {
    let sportsData;
    if (customization.sports.type === "team") {
      sportsData = await fetchSports(customization.sports);
      message += `${customization.sports.teamName} updates:\n`;
      if (customization.sports.showPreviousGame && sportsData.lastGame) {
        message += `* Last game: ${sportsData.lastGame.homeTeam} ${sportsData.lastGame.homeScore} - ${sportsData.lastGame.awayTeam} ${sportsData.lastGame.awayScore} (${sportsData.lastGame.date})\n`;
      }
      if (customization.sports.showNextGame && sportsData.nextGame) {
        message += `* Next game: ${sportsData.nextGame.event} (${sportsData.nextGame.date})\n`;
      }
    } else if (customization.sports.type === "league") {
      sportsData = await fetchSportsRecap(
        customization.sports.league,
        customization.sports.recapTeams
      );
      message += `${customization.sports.league} Recap:\n`;
      if (sportsData.events && sportsData.events.length > 0) {
        sportsData.events.forEach((event) => {
          message += `* ${event.homeTeam} ${event.homeScore} - ${event.awayTeam} ${event.awayScore}\n`;
        });
      } else {
        message += "* No games were played yesterday for the selected teams.\n";
      }
    }
    message += "\n";
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
    message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 2px;'>${customization.intro.text}</p>`;
  }

  if (customization.news.enabled) {
    let newsData;
    if (customization.news.type === "topHeadlines") {
      newsData = await fetchTopHeadlines(customization.news.topic);
      message += `<h3 style='color: #404040; font-size: 14px; margin-top: 10px; margin-bottom: 2px;'><strong>${capitalizeFirstLetter(
        customization.news.topic
      )} News:</strong></h3>`;
    } else if (customization.news.type === "customSearch") {
      newsData = await fetchCustomNews(customization.news.customQuery);
      message += `<h3 style='color: #404040; font-size: 14px; margin-top: 10px; margin-bottom: 2px;'><strong>${customization.news.customQuery} News:</strong></h3>`;
    }

    for (const article of newsData) {
      message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 2px;'>* ${article.title}`;
      if (customization.news.includeLinks) {
        const shortUrl = await shortenUrl(article.url);
        message += ` <a href="${shortUrl}" style="color: #0000FF;">${shortUrl}</a>`;
      }
      message += "</p>";
    }
  }

  if (customization.weather.enabled) {
    const weatherData = await fetchWeather(customization.weather);
    message += `<h3 style='color: #404040; font-size: 14px; margin-top: 10px; margin-bottom: 2px;'><strong>Weather${
      customization.weather.city ? ` in ${customization.weather.city}` : ""
    }:</strong></h3>`;
    message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 2px;'>${weatherData.replace(
      /\n/g,
      "<br>"
    )}</p>`;
  }

  if (customization.sports.enabled) {
    let sportsData;
    if (customization.sports.type === "team") {
      sportsData = await fetchSports(customization.sports);
      message += `<h3 style='color: #404040; font-size: 14px; margin-top: 10px; margin-bottom: 2px;'><strong>${customization.sports.teamName} updates:</strong></h3>`;
      if (customization.sports.showPreviousGame && sportsData.lastGame) {
        message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 2px;'>* Last game: ${sportsData.lastGame.homeTeam} ${sportsData.lastGame.homeScore} - ${sportsData.lastGame.awayTeam} ${sportsData.lastGame.awayScore} (${sportsData.lastGame.date})</p>`;
      }
      if (customization.sports.showNextGame && sportsData.nextGame) {
        message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 2px;'>* Next game: ${sportsData.nextGame.event} (${sportsData.nextGame.date})</p>`;
      }
    } else if (customization.sports.type === "league") {
      sportsData = await fetchSportsRecap(
        customization.sports.league,
        customization.sports.recapTeams
      );
      message += `<h3 style='color: #404040; font-size: 14px; margin-top: 10px; margin-bottom: 2px;'><strong>${customization.sports.league} Recap:</strong></h3>`;
      if (sportsData.events && sportsData.events.length > 0) {
        sportsData.events.forEach((event) => {
          message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 2px;'>* ${event.homeTeam} ${event.homeScore} - ${event.awayTeam} ${event.awayScore}</p>`;
        });
      } else {
        message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 2px;'>* No games were played yesterday for the selected teams.</p>`;
      }
    }
  }

  if (customization.events.enabled) {
    const eventsData = await fetchEvents(customization.events.country);
    message += `<h3 style='color: #404040; font-size: 14px; margin-top: 10px; margin-bottom: 2px;'><strong>${customization.events.country} Holidays:</strong></h3>`;
    message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 2px;'>${eventsData.replace(
      /\n/g,
      "<br>"
    )}</p>`;
  }

  if (customization.onThisDay && customization.onThisDay.enabled) {
    const onThisDayData = await fetchOnThisDay();
    if (onThisDayData) {
      message += `<h3 style='color: #404040; font-size: 14px; margin-top: 4px; margin-bottom: 2px;'><strong>On This Day in History:</strong></h3>`;
      message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 8px;'>${onThisDayData.replace(
        /\n/g,
        "<br>"
      )}</p>`;
    }
  }

  if (customization.randomFact && customization.randomFact.enabled) {
    const randomFactData = await fetchRandomFact();
    message += `<h3 style='color: #404040; font-size: 14px; margin-top: 4px; margin-bottom: 2px;'><strong>Fun Fact:</strong></h3>`;
    message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 8px;'>${randomFactData}</p>`;
  }

  if (customization.horoscope.enabled && customization.horoscope.sign) {
    const horoscopeData = await fetchHoroscope(customization.horoscope.sign);
    message += `<h3 style='color: #404040; font-size: 14px; margin-top: 4px; margin-bottom: 2px;'><strong>Horoscope:</strong></h3>`;
    message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 8px;'>${horoscopeData}</p>`;
  }

  if (customization.quotes.enabled) {
    const quoteData = await fetchQuote();
    message += `<h3 style='color: #404040; font-size: 14px; margin-top: 4px; margin-bottom: 2px;'><strong>Quote of the day:</strong></h3>`;
    message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 8px;'><em>${
      quoteData.split('" - ')[0]
    }"</em> - ${quoteData.split('" - ')[1]}</p>`;
  }

  if (customization.conclusion.text) {
    message += `<p style='color: #404040; margin-top: 2px; margin-bottom: 8px;'>${customization.conclusion.text}</p>`;
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

  return filteredArticles.slice(0, 3);
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

  return filteredArticles.slice(0, 3);
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
  let weatherMessage = formatWeatherData(response.data, weatherConfig);

  if (weatherConfig.showAirQuality) {
    const airQualityData = await fetchAirQuality(
      weatherConfig.latitude,
      weatherConfig.longitude
    );
    weatherMessage += formatAirQualityData(
      airQualityData,
      weatherConfig.airQualityOptions
    );
  }

  return weatherMessage;
}

async function fetchAirQuality(lat, lon) {
  try {
    const response = await axios.get("https://goodmornin.app/api/air", {
      params: { lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return null;
  }
}

function formatAirQualityData(data, options) {
  if (!data) return "Air quality data unavailable.\n";

  let message = "";
  const components = {
    co: "CO",
    no: "NO",
    no2: "NO2",
    o3: "O3",
    so2: "SO2",
    pm2_5: "PM2.5",
    pm10: "PM10",
    nh3: "NH3",
  };

  for (const [key, label] of Object.entries(components)) {
    if (options[key] && data[key] !== undefined) {
      message += `* ${label}: ${data[key]} mcg/m3\n`;
    }
  }

  return message;
}

async function fetchEvents(country) {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
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
    if (
      response.data &&
      response.data.events &&
      response.data.events.length > 0
    ) {
      return response.data.events
        .map((event) => `${event.year}: ${event.text}`)
        .join("\n");
    } else {
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

async function fetchSportsRecap(league, recapTeams) {
  try {
    const response = await axios.get(
      `https://goodmornin.app/api/recap?league=${encodeURIComponent(league)}`
    );
    const allEvents = response.data.events || [];

    // Filter events to only include the selected recap teams
    const filteredEvents = allEvents.filter(
      (event) =>
        recapTeams.includes(event.homeTeam) ||
        recapTeams.includes(event.awayTeam)
    );

    return { events: filteredEvents };
  } catch (error) {
    console.error("Error fetching sports recap:", error);
    return { events: [] };
  }
}
