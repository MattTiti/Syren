import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const zenQuotesUrl = "https://zenquotes.io/api/random";

  try {
    const response = await axios.get(zenQuotesUrl);
    const [quote] = response.data;

    if (!quote) {
      return NextResponse.json({ error: "No quote found" }, { status: 404 });
    }

    return NextResponse.json({
      quote: quote.q,
      author: quote.a,
    });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}
