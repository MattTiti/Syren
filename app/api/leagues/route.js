import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_SPORTS_API_KEY;
  const leaguesApiUrl = `https://www.thesportsdb.com/api/v1/json/${apiKey}/all_leagues.php`;

  try {
    const response = await axios.get(leaguesApiUrl);
    const leagues = response.data.leagues;

    if (!leagues) {
      return NextResponse.json({ error: "No leagues found" }, { status: 404 });
    }

    return NextResponse.json({ leagues });
  } catch (error) {
    console.error("Error fetching leagues:", error);
    return NextResponse.json(
      { error: "Failed to fetch leagues" },
      { status: 500 }
    );
  }
}
