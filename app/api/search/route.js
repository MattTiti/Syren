import { NextResponse } from "next/server";
import axios from "axios";

const FATSECRET_API_URL = "https://platform.fatsecret.com/rest/server.api";
const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
const CLIENT_ID = process.env.FATSECRET_CLIENT_ID;
const CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET;

let accessToken = null;
let tokenExpiration = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiration) {
    return accessToken;
  }

  const response = await axios.post(
    TOKEN_URL,
    "grant_type=client_credentials&scope=basic",
    {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = response.data.access_token;
  tokenExpiration = Date.now() + response.data.expires_in * 1000;
  return accessToken;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const token = await getAccessToken();

    const response = await axios.get(FATSECRET_API_URL, {
      params: {
        method: "foods.search",
        search_expression: query,
        format: "json",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      "Error searching foods:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: "Error searching foods" },
      { status: 500 }
    );
  }
}
