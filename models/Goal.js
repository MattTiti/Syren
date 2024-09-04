import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  calories: { type: Number, default: 2000 },
  protein: { type: Number, default: 150 },
  carbs: { type: Number, default: 250 },
  fat: { type: Number, default: 70 },
}, { timestamps: true });

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);