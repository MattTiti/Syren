import { NextResponse } from "next/server";

export async function GET() {
  const zenQuotesUrl = "https://zenquotes.io/api/today";

  try {
    // const revalidateTime = 86400;

    const response = await fetch(zenQuotesUrl, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Error response from ZenQuotes API: ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const [quote] = data;

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
