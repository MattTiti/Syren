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

  await connectMongo();

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
          lastAdded: { $max: "$date" },
        },
      },
      { $sort: { lastAdded: -1 } },
      {
        $project: {
          _id: 0,
          name: 1,
          calories: 1,
          protein: 1,
          carbs: 1,
          fat: 1,
          lastAdded: 1,
        },
      },
    ];

    const result = await UserMeals.aggregate(pipeline);

    // Additional check to ensure sorting
    const sortedResult = result.sort(
      (a, b) => new Date(b.lastAdded) - new Date(a.lastAdded)
    );

    return NextResponse.json({ foods: sortedResult }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/foods:", error);
    return NextResponse.json(
      { message: "Error fetching saved foods", error: error.message },
      { status: 500 }
    );
  }
}
