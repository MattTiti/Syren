"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [team, setTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [weather, setWeather] = useState(null);
  const [sports, setSports] = useState(null);
  const [lastGame, setLastGame] = useState(null);
  const [error, setError] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [newsCategory, setNewsCategory] = useState("general");
  const [news, setNews] = useState([]);
  const [quote, setQuote] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventDate, setEventDate] = useState("");
  const [eventCountry, setEventCountry] = useState("US");
  const [zodiacSign, setZodiacSign] = useState("");
  const [horoscope, setHoroscope] = useState(null);
  const [customNewsQuery, setCustomNewsQuery] = useState("");
  const [customNews, setCustomNews] = useState([]);
  const [onThisDayEvents, setOnThisDayEvents] = useState([]);
  const [onThisDayError, setOnThisDayError] = useState(null);

  useEffect(() => {
    fetchLeagues();
    fetchQuote();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      setTeam(""); // Clear selected team when league changes
      fetchTeams();
    } else {
      setTeams([]); // Clear teams when no league is selected
    }
  }, [selectedLeague]);

  useEffect(() => {
    fetchNews();
  }, [newsCategory]);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await fetch("/api/leagues");
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setLeagues(data.leagues);
      }
    } catch (err) {
      setError("Failed to fetch leagues");
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `/api/weather?lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      console.log(data);
      if (data.error) {
        setError(data.error);
        setWeather(null);
      } else {
        setWeather(data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch weather data");
    }
  };
  console.log(teams);
  const fetchTeams = async () => {
    try {
      const response = await fetch(`/api/teams?league=${selectedLeague}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setTeams([]);
      } else {
        setTeams(data.teams);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch teams");
      setTeams([]);
    }
  };

  const fetchLastGame = async () => {
    try {
      const response = await fetch(`/api/lastGame?teamId=${team}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setLastGame(null);
      } else {
        setLastGame(data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch last game data");
      setLastGame(null);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news?category=${newsCategory}`);
      const data = await response.json();
      console.log(data);
      if (data.error) {
        setError(data.error);
        setNews([]);
      } else {
        setNews(data.articles);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch news");
      setNews([]);
    }
  };

  const fetchQuote = async () => {
    try {
      const response = await fetch("/api/quotes");
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setQuote(null);
      } else {
        setQuote(data);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch quote");
      setQuote(null);
    }
  };

  const fetchEvents = async () => {
    if (!eventDate || !eventCountry) {
      setError("Please select a date and country for events");
      return;
    }

    const [year, month, day] = eventDate.split("-");
    try {
      const response = await fetch(
        `/api/events?day=${day}&month=${month}&year=${year}&country=${eventCountry}`
      );
      const data = await response.json();
      if (response.ok) {
        setEvents(data);
        setError(null);
      } else {
        throw new Error(data.error || "Failed to fetch events");
      }
    } catch (err) {
      setError("Failed to fetch events");
      setEvents([]);
    }
  };

  const fetchHoroscope = async () => {
    if (!zodiacSign) {
      setError("Please select a zodiac sign");
      return;
    }
    try {
      const response = await fetch(
        `https://goodmornin.app/api/horoscope?sign=${zodiacSign}`
      );
      const data = await response.json();
      if (response.ok) {
        setHoroscope(data);
        setError(null);
      } else {
        throw new Error(data.error || "Failed to fetch horoscope");
      }
    } catch (err) {
      setError("Failed to fetch horoscope");
      setHoroscope(null);
    }
  };

  const fetchCustomNews = async () => {
    if (!customNewsQuery.trim()) {
      setError("Please enter a search query for custom news");
      return;
    }

    try {
      const response = await fetch(
        `/api/customNews?q=${encodeURIComponent(customNewsQuery)}`
      );
      const data = await response.json();
      if (response.ok) {
        setCustomNews(data.articles);
        setError(null);
      } else {
        throw new Error(data.error || "Failed to fetch custom news");
      }
    } catch (err) {
      setError("Failed to fetch custom news");
      setCustomNews([]);
    }
  };

  const fetchOnThisDayEvents = async () => {
    try {
      const response = await axios.get("/api/history");
      setOnThisDayEvents(response.data.events);
      setOnThisDayError(null);
    } catch (err) {
      console.error("Error fetching On This Day events:", err);
      setOnThisDayError("Failed to fetch historical events");
      setOnThisDayEvents([]);
    }
  };

  return (
    <div>
      <h1>Weather and Sports Dashboard</h1>

      <div>
        <h2>Weather</h2>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter latitude"
          />
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter longitude"
          />
          <button onClick={fetchWeather}>Get Weather</button>
        </div>
        {weather && (
          <div>
            <h3>
              Weather for {latitude}, {longitude}
            </h3>
            <p>Temperature: {weather.temperature.day}°F</p>
            <p>Feels like: {weather.feelsLike.day}°F</p>
            <p>High: {weather.maxTemp}°F</p>
            <p>Low: {weather.minTemp}°F</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>
              Wind: {weather.windSpeed} mph from {weather.windDirection}°
            </p>
            {weather.rain && (
              <p>Chance of rain: {(weather.rain * 100).toFixed(0)}%</p>
            )}
            {weather.summary && <p>Summary: {weather.summary}</p>}
          </div>
        )}
      </div>

      <div>
        <h2>Sports</h2>
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
        >
          <option value="">Select a league</option>
          {leagues.map((league) => (
            <option key={league.idLeague} value={league.strLeague}>
              {league.strLeague}
            </option>
          ))}
        </select>
        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          disabled={!selectedLeague}
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.idTeam} value={team.idTeam}>
              {team.strTeam}
            </option>
          ))}
        </select>
        <button onClick={fetchLastGame} disabled={!team}>
          Get Last Game Info
        </button>

        {lastGame && (
          <div>
            <h3>
              Last Game: {lastGame.homeTeam} vs {lastGame.awayTeam}
            </h3>
            <p>
              {lastGame.homeTeam} Score: {lastGame.homeScore}
            </p>
            <p>
              {lastGame.awayTeam} Score: {lastGame.awayScore}
            </p>
            <p>Date: {lastGame.date}</p>
            <p>League: {lastGame.league}</p>
          </div>
        )}
      </div>

      {error && <p>{error}</p>}

      <div>
        <h2>News</h2>
        <select
          value={newsCategory}
          onChange={(e) => setNewsCategory(e.target.value)}
        >
          <option value="general">General</option>
          <option value="business">Business</option>
          <option value="entertainment">Entertainment</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
        </select>
        {news && (
          <div>
            <h3>Top Headlines in {newsCategory}</h3>
            {news.map((article) => (
              <div key={article.url}>
                <h4>{article.title}</h4>
                <p>{article.description}</p>
                <p>{article.url}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2>Events</h2>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
        <input
          type="text"
          value={eventCountry}
          onChange={(e) => setEventCountry(e.target.value)}
          placeholder="Enter country code (e.g., US)"
        />
        <button onClick={fetchEvents}>Get Events</button>
        {events.length > 0 && (
          <div>
            <h3>
              Events for {eventDate} in {eventCountry}:
            </h3>
            <ul>
              {events.map((event, index) => (
                <li key={index}>{event.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2>Daily Horoscope</h2>
        <select
          value={zodiacSign}
          onChange={(e) => setZodiacSign(e.target.value)}
        >
          <option value="">Select your zodiac sign</option>
          <option value="aries">Aries</option>
          <option value="taurus">Taurus</option>
          <option value="gemini">Gemini</option>
          <option value="cancer">Cancer</option>
          <option value="leo">Leo</option>
          <option value="virgo">Virgo</option>
          <option value="libra">Libra</option>
          <option value="scorpio">Scorpio</option>
          <option value="sagittarius">Sagittarius</option>
          <option value="capricorn">Capricorn</option>
          <option value="aquarius">Aquarius</option>
          <option value="pisces">Pisces</option>
        </select>
        <button onClick={fetchHoroscope}>Get Horoscope</button>
        {horoscope && (
          <div>
            <h3>Horoscope for {horoscope}</h3>
            <p>Date Range: {horoscope.date_range}</p>
            <p>Current Date: {horoscope.current_date}</p>
            <p>Description: {horoscope.description}</p>
            <p>Compatibility: {horoscope.compatibility}</p>
            <p>Mood: {horoscope.mood}</p>
            <p>Color: {horoscope.color}</p>
            <p>Lucky Number: {horoscope.lucky_number}</p>
            <p>Lucky Time: {horoscope.lucky_time}</p>
          </div>
        )}
      </div>

      {quote && (
        <div>
          <h3>Quote of the Day</h3>
          <p>{quote.quote}</p>
          <p>— {quote.author}</p>
        </div>
      )}

      {error && <p>{error}</p>}

      <div>
        <h2>Custom News Search</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={customNewsQuery}
            onChange={(e) => setCustomNewsQuery(e.target.value)}
            placeholder="Enter search query"
          />
          <button onClick={fetchCustomNews}>Search News</button>
        </div>
        {customNews.length > 0 && (
          <div>
            <h3>Custom News Results</h3>
            {customNews.map((article, index) => (
              <div key={index}>
                <h4>{article.title}</h4>
                <p>{article.description}</p>
                <p>Source: {article.source}</p>
                <p>
                  Published: {new Date(article.publishedAt).toLocaleString()}
                </p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2>On This Day in History</h2>
        <button onClick={fetchOnThisDayEvents}>Get Historical Events</button>
        {onThisDayError && <p>{onThisDayError}</p>}
        {onThisDayEvents.length > 0 && (
          <div>
            <h3>Historical Events:</h3>
            <ul>
              {onThisDayEvents.map((event, index) => (
                <li key={index}>
                  {event.year}: {event.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
