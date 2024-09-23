import { NextResponse } from "next/server";

export async function GET(request) {
  const today = new Date();
  const month = today.getMonth() + 1; // getMonth() returns 0-11
  const day = today.getDate();

  try {
    const response = await fetch(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`
    );

    if (!response.ok) {
      console.error(
        `Error response from Wikipedia API: ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Select a random subset of events, excluding long ones
    const selectedEvents = selectRandomEvents(data.events, 3, 100);

    return NextResponse.json({ events: selectedEvents });
  } catch (error) {
    console.error("Error fetching On This Day events:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch On This Day events" },
      { status: 500 }
    );
  }
}

function selectRandomEvents(events, count, maxLength = 100) {
  // Filter out events that are too long
  const shortEvents = events.filter((event) => event.text.length <= maxLength);

  // Shuffle the remaining events
  const shuffled = shortEvents.sort(() => 0.5 - Math.random());

  // Select the first 'count' events
  const selected = shuffled.slice(0, count);

  return selected.map((event) => ({
    year: event.year,
    text: event.text,
  }));
}
