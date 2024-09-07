import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "New York"; // Default city

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  try {
    const response = await axios.get(weatherApiUrl);
    const data = response.data;
    console.log("weatherdata", data);
    return NextResponse.json({
      city: data.name,
      description: data.weather[0].description,
      temperature: data.main.temp,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
