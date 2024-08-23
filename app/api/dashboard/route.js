import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Expense from "@/models/Expense";

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");
  const month = req.nextUrl.searchParams.get("month");

  if (!userId || !month) {
    return NextResponse.json(
      { error: "User ID and Month are required" },
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    // Fetch expenses for the user and month
    const monthlyExpenses = await Expense.find({ userId, month }).lean();
    const allExpenses = await Expense.find({ userId }).lean();

    return NextResponse.json({ monthlyExpenses, allExpenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Error fetching expenses" },
      { status: 500 }
    );
  }
}
