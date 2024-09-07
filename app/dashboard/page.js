"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [city, setCity] = useState("");
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

  useEffect(() => {
    fetchLeagues();
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
      const response = await fetch(`/api/weather?city=${city}`);
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
      const response = await fetch(`/api/games?teamId=${team}`);
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

  return (
    <div>
      <h1>Weather and Sports Dashboard</h1>

      <div>
        <h2>Weather</h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={fetchWeather}>Get Weather</button>
        {weather && (
          <div>
            <h3>Weather in {weather.city}</h3>
            <p>{weather.description}</p>
            <p>{weather.temperature}°F</p>
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

      {quote && (
        <div>
          <h3>Quote of the Day</h3>
          <p>{quote.quote}</p>
          <p>— {quote.author}</p>
        </div>
      )}
    </div>
  );
}
