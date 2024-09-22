import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign");

  if (!sign) {
    return NextResponse.json(
      { error: "Sign parameter is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error(`Error response from external API: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

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
