import { NextResponse } from "next/server";

export async function GET() {
  const zenQuotesUrl = "https://zenquotes.io/api/today";

  try {
    const revalidateTime =
      secondsUntilNextMidnightInTimeZone("America/New_York");

    const response = await fetch(zenQuotesUrl, {
      next: { revalidate: revalidateTime },
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

function secondsUntilNextMidnightInTimeZone(timeZone) {
  const now = new Date();
  const nowInTZ = new Date(now.toLocaleString("en-US", { timeZone }));
  const nextMidnightInTZ = new Date(
    nowInTZ.getFullYear(),
    nowInTZ.getMonth(),
    nowInTZ.getDate() + 1,
    0,
    0,
    0
  );

  // Convert next midnight in time zone back to UTC
  const nextMidnightUTC = new Date(
    nextMidnightInTZ.toLocaleString("en-US", { timeZone: "UTC" })
  );

  return Math.floor((nextMidnightUTC - now) / 1000);
}
