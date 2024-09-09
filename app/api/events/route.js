import { NextResponse } from "next/server";

const API_KEY = process.env.CALENDARIFIC_API_KEY;
const BASE_URL = "https://calendarific.com/api/v2/holidays";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const country = searchParams.get("country");

  if (!day || !month || !year || !country) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  const url = `${BASE_URL}?api_key=${API_KEY}&country=${country}&year=${year}&month=${month}&day=${day}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.meta.code !== 200) {
      return NextResponse.json(
        { error: data.meta.error_type },
        { status: data.meta.code }
      );
    }

    return NextResponse.json(data.response.holidays);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
