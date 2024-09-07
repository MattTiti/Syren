import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId"); // Team ID from the client

  const apiKey = process.env.NEXT_PUBLIC_SPORTS_API_KEY;
  const sportsApiUrl = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventslast.php?id=${teamId}`;

  try {
    const response = await axios.get(sportsApiUrl);
    const lastGame = response.data.results[0]; // Get the most recent game

    return NextResponse.json({
      homeTeam: lastGame.strHomeTeam,
      awayTeam: lastGame.strAwayTeam,
      homeScore: lastGame.intHomeScore,
      awayScore: lastGame.intAwayScore,
      date: lastGame.dateEvent,
      league: lastGame.strLeague,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch last game data" },
      { status: 500 }
    );
  }
}
