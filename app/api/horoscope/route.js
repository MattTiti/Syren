import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("Horoscope API route called");

  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign");

  console.log(`Requested horoscope for sign: ${sign}`);

  if (!sign) {
    console.log("Error: Sign parameter is missing");
    return NextResponse.json(
      { error: "Sign parameter is required" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching horoscope from external API for sign: ${sign}`);
    const response = await fetch(
      `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`,
      {
        method: "GET",
      }
    );

    console.log(`External API response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Error response from external API: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Horoscope data received:", JSON.stringify(data, null, 2));

    return NextResponse.json({ horoscope: data.data.horoscope_data });
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    return NextResponse.json(
      { error: "Failed to fetch horoscope" },
      { status: 500 }
    );
  }
}
