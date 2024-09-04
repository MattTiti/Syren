import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import UserMeals from "@/models/UserMeals";

export async function GET(req) {
  await connectMongo();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    console.log('Received GET request for weekly meals with params:', { userId, startDate, endDate });

    if (!userId || !startDate || !endDate) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    // Fetch meals for the date range
    const weeklyMeals = await UserMeals.find({ 
      userId, 
      date: { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      } 
    }).sort({ date: 1 });

    return NextResponse.json({ meals: weeklyMeals }, { status: 200 });

  } catch (error) {
    console.error("Error in GET /api/meals/weekly:", error);
    return NextResponse.json(
      { message: "Error fetching weekly meals", error: error.message },
      { status: 500 }
    );
  }
}