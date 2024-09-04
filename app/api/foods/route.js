import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import UserMeals from "@/models/UserMeals";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  console.log("User ID:", userId);

  await connectMongo();
  console.log("Connected to MongoDB");

  try {
    const userIdObj = new ObjectId(userId);

    console.log("UserMeals model:", UserMeals);
    console.log("Collection name:", UserMeals.collection.name);

    const pipeline = [
      { $match: { userId: userIdObj } },
      { $unwind: "$meals" },
      { $unwind: "$meals.foods" },
      {
        $group: {
          _id: "$meals.foods.name",
          name: { $first: "$meals.foods.name" },
          calories: { $first: "$meals.foods.calories" },
          protein: { $first: "$meals.foods.protein" },
          carbs: { $first: "$meals.foods.carbs" },
          fat: { $first: "$meals.foods.fat" },
        },
      },
      { $sort: { name: 1 } },
    ];

    const result = await UserMeals.aggregate(pipeline);

    return NextResponse.json({ foods: result }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/foods:", error);
    return NextResponse.json(
      { message: "Error fetching saved foods", error: error.message },
      { status: 500 }
    );
  }
}
