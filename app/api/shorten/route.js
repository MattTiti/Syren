import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { url } = await req.json();

  try {
    const apiKey = process.env.TINYURL_API_KEY;
    if (!apiKey) {
      throw new Error("TinyURL API key is not set");
    }

    const response = await axios.post(
      "https://api.tinyurl.com/create",
      {
        url: url,
        domain: "tinyurl.com",
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const shortUrl = response.data.data.tiny_url;

    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error("Error shortening URL:", error);
    return NextResponse.json(
      { error: "Failed to shorten URL" },
      { status: 500 }
    );
  }
}
