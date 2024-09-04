import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import UserMeals from "@/models/UserMeals";

export async function GET(req) {
  await connectMongo();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    console.log('Received GET request with params:', { userId, date });

    // Fetch meals and goal from the database
    const userMeals = await UserMeals.findOne({ 
      userId, 
      date: new Date(date) 
    });

    if (!userMeals) {
      // If no meals found, return an empty array and null goal
      return NextResponse.json({ meals: [], goal: null }, { status: 200 });
    }

    // Return the meals and goal if found
    return NextResponse.json({ 
      meals: userMeals.meals, 
      goal: userMeals.goal 
    }, { status: 200 });

  } catch (error) {
    console.error("Error in GET /api/meals:", error);
    return NextResponse.json(
      { message: "Error fetching meals and goal", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  await connectMongo();

  try {
    const { userId, date, meals, goal } = await req.json();

    // Log the received data
    console.log("Received data:", { userId, date, meals, goal });

    // Validate the request body
    if (!userId || !date || !meals || !Array.isArray(meals)) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    // Find or create a document for the user's meals on the given date
    const result = await UserMeals.findOneAndUpdate(
      { userId, date: new Date(date) }, // Find by userId and date
      { meals, goal }, // Replace meals and goal with the new data
      { new: true, upsert: true } // Create if doesn't exist and return the new document
    );

    return NextResponse.json(
      { message: "Meals and goal saved successfully!", data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving meals and goal:", error);
    return NextResponse.json(
      { message: "Error saving meals and goal", error: error.message },
      { status: 500 }
    );
  }
}
