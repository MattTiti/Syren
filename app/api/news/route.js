import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "general"; // Default to general if no category is specified

  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY; // Make sure to set this in your .env.local file
  const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(newsApiUrl);
    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        { error: "No articles found for the specified category" },
        { status: 404 }
      );
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
