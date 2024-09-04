import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLineChart from "./DashboardLineChart";

// Add this function
const formatDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
};

const DashboardWeeklyCalories = ({ weeklyCalories, selectedWeek }) => {
  const caloriesByDay = useMemo(() => {
    return weeklyCalories.map((day) => {
      const totalCalories = day.meals.reduce((total, meal) => {
        return (
          total +
          meal.foods.reduce(
            (mealTotal, food) => mealTotal + (food.calories || 0),
            0
          )
        );
      }, 0);
      return {
        day: formatDate(day.date),
        calories: totalCalories,
      };
    });
  }, [weeklyCalories]);

  const highestCalorieDay = caloriesByDay.reduce(
    (max, curr) => (curr.calories > max.calories ? curr : max),
    caloriesByDay[0] || { day: "N/A", calories: 0 }
  );

  const lowestCalorieDay = caloriesByDay.reduce(
    (min, curr) => (curr.calories < min.calories ? curr : min),
    caloriesByDay[0] || { day: "N/A", calories: 0 }
  );

  const endDate = new Date(selectedWeek);
  endDate.setDate(endDate.getDate() - 1); // This should be one day before the selected day
  const startDate = new Date(selectedWeek);
  startDate.setDate(startDate.getDate() - 7); // This should be 7 days before the selected day

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Calorie Intake</CardTitle>
        <CardDescription>
          {formatDate(startDate)} - {formatDate(endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <DashboardLineChart
          data={caloriesByDay}
          selectedKey="day"
          dataKey="calories"
          chartConfig={{
            calories: {
              label: "Calories",
            },
          }}
        />
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-2">
        <div className="flex items-center gap-2 font-medium leading-none">
          Highest calorie day — {highestCalorieDay.day} (
          {highestCalorieDay.calories} calories)
        </div>
        <div className="leading-none text-muted-foreground">
          Lowest calorie day — {lowestCalorieDay.day} (
          {lowestCalorieDay.calories} calories)
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardWeeklyCalories;
