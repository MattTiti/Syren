import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import UserCustomization from "@/models/UserCustomization";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const users = await User.find({ customerId: { $exists: true } });
    let deactivatedCount = 0;
    let deletedCustomizationsCount = 0;

    for (const user of users) {
      if (!user?.customerId) {
        continue;
      }
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.customerId,
          status: "active",
        });

        if (subscriptions.data.length === 0) {
          // No active subscriptions, update user and delete customization
          await User.findByIdAndUpdate(user._id, { hasAccess: false });
          const deletedCustomization = await UserCustomization.findOneAndDelete(
            { userId: user._id }
          );

          deactivatedCount++;
          if (deletedCustomization) deletedCustomizationsCount++;
        }
      } catch (error) {
        console.error(`Error processing user ${user._id}:`, error);
      }
    }

    return NextResponse.json(
      {
        message: "Database cleaned successfully",
        deactivatedUsers: deactivatedCount,
        deletedCustomizations: deletedCustomizationsCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cleaning database:", error);
    return NextResponse.json(
      { error: "Failed to clean database" },
      { status: 500 }
    );
  }
}
