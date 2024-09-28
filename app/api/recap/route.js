import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league");

  // Get yesterday's date in YYYY-MM-DD format
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedDate = yesterday.toISOString().split("T")[0];

  const apiKey = process.env.NEXT_PUBLIC_SPORTS_API_KEY;
  const sportsApiUrl = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsday.php?d=${formattedDate}&l=${encodeURIComponent(
    league
  )}`;

  try {
    const response = await axios.get(sportsApiUrl);
    const events = response.data.events || [];

    const formattedEvents = events.map((event) => ({
      homeTeam: event.strHomeTeam,
      awayTeam: event.strAwayTeam,
      homeScore: event.intHomeScore,
      awayScore: event.intAwayScore,
      date: event.dateEvent,
      league: event.strLeague,
      event: event.strEventAlternate,
    }));

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error(
      "Error fetching sports recap:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch sports recap data" },
      { status: 500 }
    );
  }
}
