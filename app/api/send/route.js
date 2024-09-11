import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { phoneNumber, message } = await req.json();

    const response = await axios.post(
      "https://api.telnyx.com/v2/messages",
      {
        from: "+13324558778",
        to: phoneNumber,
        text: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TELNYX_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error sending text:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to send text message" },
      { status: 500 }
    );
  }
}
