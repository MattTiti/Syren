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

    // Find users who have opted in and whose delivery time is within the next 30 minutes
    const users = await UserCustomization.find({
      "customization.messaging.enabled": true,
      "customization.messaging.consentGiven": true,
      $expr: {
        $and: [
          { $eq: [{ $hour: "$deliveryTime" }, currentHour] },
          {
            $lte: [
              { $subtract: [{ $minute: "$deliveryTime" }, currentMinute] },
              30,
            ],
          },
          {
            $gte: [
              { $subtract: [{ $minute: "$deliveryTime" }, currentMinute] },
              0,
            ],
          },
        ],
      },
    });

    for (const user of users) {
      const message = await generateDailyMessage(user.customization);
      await sendText(user.phoneNumber, message);
    }

    return NextResponse.json(
      { message: "Daily texts sent successfully", usersCount: users.length },
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

// import { NextResponse } from "next/server";
// import connectMongo from "@/libs/mongoose";
// import UserCustomization from "@/models/UserCustomization";
// import { generateDailyMessage } from "@/libs/messageGenerator";
// import { sendText } from "@/libs/textSender";

// export async function POST(req) {
//   await connectMongo();

//   try {
//     const currentHour = new Date().getUTCHours();
//     const users = await UserCustomization.find({
//       deliveryTime: { $regex: `^${currentHour.toString().padStart(2, "0")}:` },
//     });

//     for (const user of users) {
//       const message = await generateDailyMessage(user.customization);
//       await sendText(user.phoneNumber, message);
//     }

//     return NextResponse.json(
//       { message: "Daily texts sent successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error sending daily texts:", error);
//     return NextResponse.json(
//       { error: "Failed to send daily texts" },
//       { status: 500 }
//     );
//   }
// }
