import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get("league") || "NBA"; // Default to NBA if no league is specified

  const apiKey = process.env.NEXT_PUBLIC_SPORTS_API_KEY;
  const teamsApiUrl = `https://www.thesportsdb.com/api/v1/json/${apiKey}/search_all_teams.php?l=${encodeURIComponent(
    league
  )}`;

  try {
    const response = await axios.get(teamsApiUrl);
    const teams = response.data.teams;

    if (!teams) {
      return NextResponse.json(
        { error: "No teams found for the specified league" },
        { status: 404 }
      );
    }

    return NextResponse.json({ teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
