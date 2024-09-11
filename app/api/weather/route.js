import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const units = searchParams.get("units") || "imperial"; // Add this line

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=${units}&appid=${apiKey}`; // Update this line

  try {
    const response = await axios.get(weatherApiUrl);
    const data = response.data.daily;
    console.log("weatherdata", data);

    return NextResponse.json({
      summary: data.summary,
      temperature: data.temp,
      feelsLike: data.feels_like,
      humidity: data.humidity,
      windSpeed: data.wind_speed,
      windDirection: data.wind_deg,
      windGust: data.wind_gust,
      rain: data.pop,
      minTemp: data.temp.min,
      maxTemp: data.temp.max,
    });
  } catch (error) {
    console.error(
      "Error fetching weather data:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
