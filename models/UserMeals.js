import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
});

const MealSchema = new mongoose.Schema({
  foods: [FoodSchema], // Array of foods
});

const GoalSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
});

const UserMealsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  meals: [MealSchema], // Array of meals
  goal: GoalSchema, // User's nutritional goal for the day
});

export default mongoose.models.UserMeals ||
  mongoose.model("UserMeals", UserMealsSchema);
