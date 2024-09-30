import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const response = await axios.get(weatherApiUrl);
    const data = response.data.list[0];

    const airResponse = {
      aqi: data.main.aqi,
      co: data.components.co,
      no: data.components.no,
      no2: data.components.no2,
      o3: data.components.o3,
      so2: data.components.so2,
      pm2_5: data.components.pm2_5,
      pm10: data.components.pm10,
      nh3: data.components.nh3,
    };

    return NextResponse.json(airResponse);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    console.error("Error details:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
