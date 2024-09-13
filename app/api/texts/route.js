export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import connectMongo from "@/libs/mongoose";
import UserCustomization from "@/models/UserCustomization";
import { generateDailyMessage } from "@/libs/messageGenerator";
import { sendText } from "@/libs/textSender";

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
    // Get current time in EST
    const now = new Date();
    const estOffset = -5 * 60; // EST is UTC-5
    const estTime = new Date(now.getTime() + estOffset * 60 * 1000);
    const currentHour = estTime.getUTCHours();
    const currentMinute = estTime.getUTCMinutes();

    // Find all users who have opted in
    const users = await UserCustomization.find({
      "customization.messaging.enabled": true,
      "customization.messaging.consentGiven": true,
    });

    const usersToMessage = users.filter((user) => {
      const [hour, minute] = user.deliveryTime.split(":").map(Number);
      if (hour !== currentHour) return false;
      const timeDiff = minute - currentMinute;
      return timeDiff >= 0 && timeDiff < 30; // Changed to < 30 to include the 30th minute
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
