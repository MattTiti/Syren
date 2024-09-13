export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import connectMongo from "@/libs/mongoose";
import UserCustomization from "@/models/UserCustomization";
import { generateDailyMessage } from "@/libs/messageGenerator";
import { sendText } from "@/libs/textSender";
import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

function getESTTime() {
  const now = new Date();
  const estZone = "America/New_York";
  return utcToZonedTime(now, estZone);
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
    const estTime = getESTTime();
    const currentTotalMinutes = estTime.getHours() * 60 + estTime.getMinutes();

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
      try {
        const message = await generateDailyMessage(user.customization);
        await sendText(user.phoneNumber, message);
      } catch (error) {
        console.error(`Error sending message to user ${user._id}:`, error);
        // TODO: Keep track of failed messages
      }
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
