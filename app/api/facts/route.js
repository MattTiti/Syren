import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const revalidateTime =
      secondsUntilNextMidnightInTimeZone("America/New_York");

    const response = await fetch(
      "https://uselessfacts.jsph.pl/api/v2/facts/today?language=en",
      {
        next: { revalidate: revalidateTime },
      }
    );

    if (!response.ok) {
      console.error(
        `Error response from Useless Facts API: ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ fact: data.text });
  } catch (error) {
    console.error("Error fetching random fact:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch random fact" },
      { status: 500 }
    );
  }
}

// Function to calculate seconds until next midnight in specified time zone
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
