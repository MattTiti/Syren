"use client";
import { useState, useEffect } from "react";
import Nav from "@/components/custom/Nav";
import Spinner from "@/components/Spinner";
import {
  fetchWeather,
  fetchNews,
  fetchSportsData,
  fetchHolidays,
  fetchQuote,
  fetchHoroscope,
  fetchOnThisDay,
  fetchRandomFact,
} from "@/libs/dashboard";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Updates from "@/components/dashboard/Updates";
import Feedback from "@/components/dashboard/Feedback";

export default function Dashboard() {
  const { data: session } = useSession();
  const [customization, setCustomization] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState("F");
  const [windUnits, setWindUnits] = useState("mph");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Fetch user's customization settings
        const customizationResponse = await fetch("/api/customization");
        const customizationData = await customizationResponse.json();
        setCustomization(customizationData.customization);
        setUnits(
          customizationData.customization.weather.units === "imperial"
            ? "F"
            : "C"
        );
        setWindUnits(
          customizationData.customization.weather.units === "imperial"
            ? "mph"
            : "kph"
        );
        // Fetch data based on customization settings
        const data = {};

        if (customizationData.customization.weather.enabled) {
          data.weather = await fetchWeather(
            customizationData.customization.weather
          );
        }

        if (customizationData.customization.news.enabled) {
          const news = await fetchNews(customizationData.customization.news);
          data.news = news.slice(0, 5);
        }

        if (customizationData.customization.sports.enabled) {
          data.sports = await fetchSportsData(
            customizationData.customization.sports
          );
        }

        if (customizationData.customization.events.enabled) {
          data.holidays = await fetchHolidays(
            customizationData.customization.events.country
          );
        }

        if (customizationData.customization.quotes.enabled) {
          data.quote = await fetchQuote();
        }

        if (customizationData.customization.horoscope.enabled) {
          data.horoscope = await fetchHoroscope(
            customizationData.customization.horoscope.sign
          );
        }

        if (customizationData.customization.onThisDay.enabled) {
          data.onThisDay = await fetchOnThisDay();
        }

        if (customizationData.customization.randomFact.enabled) {
          data.randomFact = await fetchRandomFact();
        }
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/webhook/mailgun", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: session?.user?.email,
          Subject: `Feedback from ${session?.user?.name}`,
          "body-html": `<p><b>Name:</b> ${session?.user?.name}</p><p><b>Email:</b> ${session?.user?.email}</p><p><b>Message:</b></p><div>${feedbackMessage}</div>`,
        }),
      });

      if (response.ok) {
        toast.success("Feedback submitted successfully!");
        setFeedbackMessage("");
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const dailyBriefing = (
    <div className="space-y-4">
      {customization?.intro?.text && <p>{customization.intro.text}</p>}

      {dashboardData.weather && (
        <div>
          <h3 className="font-semibold">
            Weather in {customization?.weather?.city || "[Location]"}:
          </h3>
          <p>* {dashboardData.weather.summary}</p>
          <p>
            * {dashboardData.weather.temperature}°{units}, feels like{" "}
            {dashboardData.weather.feelsLike}°{units} (
            {dashboardData.weather.minTemp}°{units} -{" "}
            {dashboardData.weather.maxTemp}°{units})
          </p>
          {customization?.weather?.showHumidity && (
            <p>* Humidity: {dashboardData.weather.humidity}%</p>
          )}
          {customization?.weather?.showWind && (
            <p>
              * Wind: {dashboardData.weather.windSpeed} {windUnits}
            </p>
          )}
          {customization?.weather?.showRain && (
            <p>
              * Chance of Rain: {(dashboardData.weather.rain * 100).toFixed(0)}%
            </p>
          )}
        </div>
      )}

      {dashboardData.news && (
        <div>
          <h3 className="font-semibold">News:</h3>
          {dashboardData.news.map((article, index) => (
            <p key={index}>
              *{" "}
              <a href={article.url} className="text-blue-500 underline">
                {article.title}
              </a>
            </p>
          ))}
        </div>
      )}

      {dashboardData.sports && (
        <div>
          <h3 className="font-semibold">
            {customization?.sports?.teamName} updates:
          </h3>
          {dashboardData.sports.lastGame && (
            <p>
              * {dashboardData.sports.lastGame.homeTeam}{" "}
              {dashboardData.sports.lastGame.homeScore} -{" "}
              {dashboardData.sports.lastGame.awayTeam}{" "}
              {dashboardData.sports.lastGame.awayScore} (
              {dashboardData.sports.lastGame.date})
            </p>
          )}
          {dashboardData.sports.nextGame && (
            <p>
              * {dashboardData.sports.nextGame.homeTeam} vs{" "}
              {dashboardData.sports.nextGame.awayTeam} (
              {dashboardData.sports.nextGame.date})
            </p>
          )}
        </div>
      )}

      {dashboardData.holidays && (
        <div>
          <h3 className="font-semibold">Holidays:</h3>
          {dashboardData.holidays.map((event, index) => (
            <p key={index}>
              * {event.name}: {event.description}
            </p>
          ))}
        </div>
      )}

      {dashboardData.quote && (
        <div>
          <h3 className="font-semibold">Quote of the Day:</h3>
          <p>
            "{dashboardData.quote.quote}" - {dashboardData.quote.author}
          </p>
        </div>
      )}

      {dashboardData.horoscope && (
        <div>
          <h3 className="font-semibold">Horoscope:</h3>
          <p>{dashboardData.horoscope.horoscope}</p>
        </div>
      )}

      {dashboardData.onThisDay && (
        <div>
          <h3 className="font-semibold">On This Day:</h3>
          {dashboardData.onThisDay.events.map((event, index) => (
            <p key={index}>
              * {event.year}: {event.text}
            </p>
          ))}
        </div>
      )}

      {dashboardData.randomFact && (
        <div>
          <h3 className="font-semibold">Fun Fact:</h3>
          <p>{dashboardData.randomFact.fact}</p>
        </div>
      )}

      {customization?.conclusion?.text && (
        <p>{customization.conclusion.text}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col text-neutral-700">
      <Nav />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-end mb-4">
          <h1 className="text-3xl font-bold">
            Good Mornin{session?.user?.name ? `, ${session?.user?.name}` : ""}!
          </h1>
          <p className="text-sm text-neutral-500">
            Last updated:{" "}
            {lastUpdated ? lastUpdated.toLocaleString() : "Loading..."}
          </p>
        </div>
        <div className="flex">
          <div className="w-2/3 pr-4">
            <div className="bg-white border border-neutral-200 p-4 rounded-md">
              {isLoading ? <Spinner /> : dailyBriefing}
            </div>
          </div>
          <div className="w-1/3 pl-4">
            <Updates />
            <Feedback
              handleSubmit={handleSubmit}
              feedbackMessage={feedbackMessage}
              setFeedbackMessage={setFeedbackMessage}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
