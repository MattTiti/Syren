import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Goal from "@/models/Goal";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    await connectMongo();

    const goal = await Goal.findOne({ userId });

    if (!goal) {
      const newGoal = await Goal.create({ userId });
      return NextResponse.json({ defaultGoal: newGoal });
    }

    return NextResponse.json({ defaultGoal: goal });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching default goal" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { defaultGoal } = await req.json();

    await connectMongo();

    const updatedGoal = await Goal.findOneAndUpdate(
      { userId },
      { $set: defaultGoal },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Default goal updated successfully",
      defaultGoal: updatedGoal,
    });
  } catch (error) {
    console.error("PUT: Error updating default goal:", error);
    return NextResponse.json(
      { message: "Error updating default goal" },
      { status: 500 }
    );
  }
}
