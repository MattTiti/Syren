export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import connectMongo from "@/libs/mongoose";
import UserCustomization from "@/models/UserCustomization";
import { generateDailyMessage } from "@/libs/messageGenerator";
import { sendText } from "@/libs/textSender";
import { toZonedTime } from "date-fns-tz";

function getESTTime() {
  const now = new Date();
  const estZone = "America/New_York";
  return toZonedTime(now, estZone);
}

export async function GET(req) {
  try {
    // Authenticate the request
    const authHeader = req.headers.get("authorization");
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (
      !authHeader ||
      !timingSafeEqual(Buffer.from(authHeader), Buffer.from(expectedAuth))
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Connect to MongoDB with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await connectMongo();
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }

    const estTime = getESTTime();
    const currentTotalMinutes = estTime.getHours() * 60 + estTime.getMinutes();

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

    let successCount = 0;
    let failedCount = 0;
    const failedUsers = [];

    for (const user of usersToMessage) {
      try {
        const message = await generateDailyMessage(user.customization);
        await sendText(user.phoneNumber, message);
        successCount++;
      } catch (error) {
        console.error(`Error sending message to user ${user._id}:`, error);
        failedCount++;
        failedUsers.push(user._id);
      }
    }

    return NextResponse.json(
      {
        message: `Daily texts processed. ${successCount} succeeded, ${failedCount} failed.`,
        totalAttempted: usersToMessage.length,
        successCount,
        failedCount,
        failedUsers,
      },
      { status: failedCount > 0 ? 207 : 200 }
    );
  } catch (error) {
    console.error("Critical error in daily texts route:", error);
    return NextResponse.json(
      { error: "Failed to process daily texts" },
      { status: 500 }
    );
  }
}
