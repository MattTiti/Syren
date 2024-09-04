"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-1))",
  },
  carbs: {
    label: "Carbs",
    color: "hsl(var(--chart-2))",
  },
  fat: {
    label: "Fat",
    color: "hsl(var(--chart-3))",
  },
};

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

const DashboardWeeklyMacros = ({ weeklyCalories, selectedWeek }) => {
  const chartData = weeklyCalories.map((day) => ({
    day: formatDate(day.date),
    protein: day.meals.reduce(
      (total, meal) =>
        total +
        meal.foods.reduce(
          (mealTotal, food) => mealTotal + (food.protein || 0),
          0
        ),
      0
    ),
    carbs: day.meals.reduce(
      (total, meal) =>
        total +
        meal.foods.reduce(
          (mealTotal, food) => mealTotal + (food.carbs || 0),
          0
        ),
      0
    ),
    fat: day.meals.reduce(
      (total, meal) =>
        total +
        meal.foods.reduce((mealTotal, food) => mealTotal + (food.fat || 0), 0),
      0
    ),
  }));

  const endDate = new Date(selectedWeek);
  endDate.setDate(endDate.getDate() - 1); // This should be one day before the selected day
  const startDate = new Date(selectedWeek);
  startDate.setDate(startDate.getDate() - 7); // This should be 7 days before the selected day

  const averages = weeklyCalories.reduce(
    (acc, day) => {
      const dayTotals = day.meals.reduce(
        (mealAcc, meal) => {
          meal.foods.forEach((food) => {
            mealAcc.protein += food.protein || 0;
            mealAcc.carbs += food.carbs || 0;
            mealAcc.fat += food.fat || 0;
          });
          return mealAcc;
        },
        { protein: 0, carbs: 0, fat: 0 }
      );

      acc.protein += dayTotals.protein;
      acc.carbs += dayTotals.carbs;
      acc.fat += dayTotals.fat;

      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const daysCount = weeklyCalories.length;
  Object.keys(averages).forEach((key) => {
    averages[key] = Math.round(averages[key] / daysCount);
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Macronutrient Intake</CardTitle>
        <CardDescription>
          {formatDate(startDate)} - {formatDate(endDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 20,
              right: 20,
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="protein"
              type="monotone"
              stroke="var(--color-protein)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="carbs"
              type="monotone"
              stroke="var(--color-carbs)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="fat"
              type="monotone"
              stroke="var(--color-fat)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-center -mt-4">
        <span className="text-sm font-medium">Weekly Averages</span>
        <div className="flex justify-between items-center text-sm w-full mt-1 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Protein:</span> {averages.protein}g
          </div>
          <div>
            <span>Carbs:</span> {averages.carbs}g
          </div>
          <div>
            <span>Fat:</span> {averages.fat}g
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardWeeklyMacros;
