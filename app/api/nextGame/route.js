import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");

  const apiKey = process.env.NEXT_PUBLIC_SPORTS_API_KEY;
  const sportsApiUrl = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsnext.php?id=${encodeURIComponent(
    teamId
  )}`;

  try {
    const response = await axios.get(sportsApiUrl);

    if (!response.data.events || response.data.events.length === 0) {
      return NextResponse.json(
        { error: "No upcoming games scheduled" },
        { status: 404 }
      );
    }

    const nextGame = response.data.events[0]; // Get the next game

    return NextResponse.json({
      homeTeam: nextGame.strHomeTeam,
      awayTeam: nextGame.strAwayTeam,
      date: nextGame.dateEvent,
      league: nextGame.strLeague,
      venue: nextGame.strVenue,
      event: nextGame.strEventAlternate,
    });
  } catch (error) {
    console.error(
      "Error fetching next game:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch next game data" },
      { status: 500 }
    );
  }
}
