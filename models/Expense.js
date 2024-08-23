import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    expenses: [
      {
        name: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        cost: {
          type: String,
          required: true,
        },
        label: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
