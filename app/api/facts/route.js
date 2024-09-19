import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("Random Fact API route called");

  try {
    const response = await fetch(
      "https://uselessfacts.jsph.pl/api/v2/facts/today?language=en"
    );

    if (!response.ok) {
      console.error(
        `Error response from Useless Facts API: ${response.statusText}`
      );
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Random fact received:", data.text);

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
