export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import UserCustomization from "@/models/UserCustomization";
import { generateDailyMessage } from "@/libs/messageGenerator";
import { sendText } from "@/libs/textSender";

export async function GET(req) {
  await connectMongo();

  try {
    const users = await UserCustomization.find({});

    for (const user of users) {
      const message = await generateDailyMessage(user.customization);
      await sendText(user.phoneNumber, message);
    }

    return NextResponse.json(
      { message: "Daily texts sent successfully" },
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
