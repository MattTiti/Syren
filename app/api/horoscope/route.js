import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sign = searchParams.get("sign");
  const day = searchParams.get("day") || "today";

  if (!sign) {
    return NextResponse.json(
      { error: "Sign parameter is required" },
      { status: 400 }
    );
  }

  const validSigns = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ];
  if (!validSigns.includes(sign.toLowerCase())) {
    return NextResponse.json({ error: "Invalid sign" }, { status: 400 });
  }

  const validDays = ["yesterday", "today", "tomorrow"];
  if (!validDays.includes(day.toLowerCase())) {
    return NextResponse.json(
      { error: "Invalid day. Use yesterday, today, or tomorrow" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://aztro.sameerkumar.website/?sign=${sign}&day=today`,
      {
        method: "POST",
      }
    );
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch horoscope");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return NextResponse.json(
      { error: "Failed to fetch horoscope" },
      { status: 500 }
    );
  }
}
