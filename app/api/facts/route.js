import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const revalidateTime = 86400;

    const response = await fetch(
      "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en",
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
