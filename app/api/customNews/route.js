import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    query
  )}&apiKey=${apiKey}&pageSize=5&sortBy=relevancy`;

  try {
    const response = await axios.get(newsApiUrl);
    const articles = response.data.articles.map((article) => ({
      title: article.title,
      url: article.url,
    }));

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        { error: "No articles found for the specified query" },
        { status: 404 }
      );
    }

    return NextResponse.json({ articles });
  } catch (error) {
    console.error(
      "Error fetching custom news:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Failed to fetch custom news" },
      { status: 500 }
    );
  }
}
