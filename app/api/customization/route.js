import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import UserCustomization from "@/models/UserCustomization";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";

export async function GET(req) {
  await connectMongo();
  const session = await getServerSession(authOptions);

  try {
    const userId = session?.user.id;

    console.log("Received GET request with params:", { userId });

    // Fetch customization from the database
    const userCustomization = await UserCustomization.findOne({ userId });

    if (!userCustomization) {
      // If no customization found, return an empty object
      return NextResponse.json(
        { customization: {}, phoneNumber: null },
        { status: 200 }
      );
    }

    // Return the customization and phone number if found
    return NextResponse.json(
      {
        customization: userCustomization.customization,
        phoneNumber: userCustomization.phoneNumber,
        deliveryTime: userCustomization.deliveryTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/customization:", error);
    return NextResponse.json(
      { message: "Error fetching customization", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await connectMongo();

  try {
    const { customization, phoneNumber, deliveryTime } = await req.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    // Log the received data
    console.log("Received data:", {
      userId,
      customization,
      phoneNumber,
      deliveryTime,
    });

    // Validate the request body
    if (
      !userId ||
      !customization ||
      typeof customization !== "object" ||
      !phoneNumber
    ) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Find or create a document for the user's customization
    const result = await UserCustomization.findOneAndUpdate(
      { userId }, // Find by userId
      { customization, phoneNumber, deliveryTime }, // Replace customization and phoneNumber with the new data
      { new: true, upsert: true } // Create if doesn't exist and return the new document
    );

    return NextResponse.json(
      {
        message: "Customization and phone number saved successfully!",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving customization and phone number:", error);
    return NextResponse.json(
      {
        message: "Error saving customization and phone number",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
