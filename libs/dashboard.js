async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
export async function fetchWeather(weatherConfig) {
  const params = new URLSearchParams({
    lat: weatherConfig.latitude,
    lon: weatherConfig.longitude,
    units: weatherConfig.units,
  });
  const response = await fetch(`/api/weather?${params}`);
  return handleResponse(response);
}

export async function fetchNews(newsConfig) {
  if (newsConfig.type === "topHeadlines") {
    return fetchTopHeadlines(newsConfig.topic);
  } else if (newsConfig.type === "customSearch") {
    return fetchCustomNews(newsConfig.customQuery);
  }
}

async function fetchTopHeadlines(topic) {
  const response = await fetch(
    `/api/news?category=${encodeURIComponent(topic)}`
  );
  const data = await handleResponse(response);

  const filteredArticles = data.articles.filter(
    (article) => article.title !== "[Removed]"
  );

  return filteredArticles || [];
}

async function fetchCustomNews(query) {
  const response = await fetch(
    `/api/customNews?q=${encodeURIComponent(query)}`
  );
  const data = await handleResponse(response);

  const filteredArticles = data.articles.filter(
    (article) => article.title !== "[Removed]"
  );

  return filteredArticles || [];
}

export async function fetchSportsData(sportsConfig) {
  let sportsData = {};

  if (sportsConfig.type === "team") {
    if (sportsConfig.showPreviousGame) {
      const lastGameResponse = await fetch(
        `/api/lastGame?teamId=${sportsConfig.teamId}`
      );
      sportsData.lastGame = await handleResponse(lastGameResponse);
    }

    if (sportsConfig.showNextGame) {
      const nextGameResponse = await fetch(
        `/api/nextGame?teamId=${sportsConfig.teamId}`
      );
      sportsData.nextGame = await handleResponse(nextGameResponse);
    }
  } else if (sportsConfig.type === "league" && sportsConfig.showRecap) {
    const recapResponse = await fetch(
      `/api/recap?league=${encodeURIComponent(sportsConfig.league)}`
    );
    sportsData.recap = await handleResponse(recapResponse);
  }

  return sportsData;
}

export async function fetchHolidays(country) {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const params = new URLSearchParams({ day, month, year, country });
  const response = await fetch(`/api/events?${params}`);
  return handleResponse(response);
}

export async function fetchQuote() {
  const response = await fetch("/api/quotes");
  return handleResponse(response);
}

export async function fetchHoroscope(sign) {
  try {
    const response = await fetch(
      `/api/horoscope?sign=${encodeURIComponent(sign)}`
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return { horoscope: "Unable to fetch horoscope at this time." };
  }
}

export async function fetchOnThisDay() {
  try {
    const response = await fetch("/api/history");
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching On This Day events:", error);
    return null;
  }
}

export async function fetchRandomFact() {
  try {
    const response = await fetch("/api/facts");
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching random fact:", error);
    return { fact: "Unable to fetch a random fact at this time." };
  }
}
