export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import connectMongo from "@/libs/mongoose";
import UserCustomization from "@/models/UserCustomization";
import { generateDailyMessage } from "@/libs/messageGenerator";
import { sendText } from "@/libs/textSender";

function getESTOffset() {
  const now = new Date();
  const januaryOffset = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const julyOffset = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
  const isDST = now.getTimezoneOffset() < Math.max(januaryOffset, julyOffset);
  return isDST ? -4 * 60 : -5 * 60; // -4 hours for EDT, -5 hours for EST
}

export async function GET(req) {
  await connectMongo();

  const authHeader = req.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (
    !authHeader ||
    !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expectedAuth))
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    // Get current time in EST/EDT
    const now = new Date();
    const estOffset = getESTOffset();
    const estTime = new Date(now.getTime() + estOffset * 60 * 1000);
    const currentTotalMinutes =
      estTime.getUTCHours() * 60 + estTime.getUTCMinutes();

    // Find all users who have opted in
    const users = await UserCustomization.find({
      "customization.messaging.enabled": true,
      "customization.messaging.consentGiven": true,
    });

    const usersToMessage = users.filter((user) => {
      const [hour, minute] = user.deliveryTime.split(":").map(Number);
      const userTotalMinutes = hour * 60 + minute;

      // Calculate the time difference in absolute terms
      const timeDiff = Math.abs(currentTotalMinutes - userTotalMinutes);

      // Check if the difference is within ±30 minutes, also account for day wraparound
      return timeDiff <= 30 || timeDiff >= 1410; // 1440 minutes in a day, wraparound for near-midnight delivery times
    });

    for (const user of usersToMessage) {
      const message = await generateDailyMessage(user.customization);
      await sendText(user.phoneNumber, message);
    }

    return NextResponse.json(
      {
        message: "Daily texts sent successfully",
        usersCount: usersToMessage.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending daily texts:", error);
    return NextResponse.json(
      { error: "Failed to send daily texts" },
      { status: 500 }
    );
  }
}
