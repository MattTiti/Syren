import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const limit = 1;

  if (!city) {
    return NextResponse.json(
      { error: "City parameter is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenWeather API key is not configured" },
      { status: 500 }
    );
  }

  const geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}&limit=${limit}&appid=${apiKey}`;

  try {
    const response = await axios.get(geocodeUrl);
    const data = response.data;

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No results found for the given location" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching geocode data:", error);
    return NextResponse.json(
      { error: "Failed to fetch geocode data" },
      { status: 500 }
    );
  }
}
