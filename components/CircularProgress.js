"use client";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Calories",
  },
  safari: {
    label: "Calories",
    color: "hsl(var(--chart-2))",
  },
};

export function CircularProgress({ chartData, goal }) {
  const caloriesConsumed = chartData[0].value;
  const caloriesGoal = goal.calories;
  const percentage = Math.min((caloriesConsumed / caloriesGoal) * 100, 100);

  // Calculate the endAngle based on the percentage
  const startAngle = 0;
  const fullAngle = 360; // The full circle angle used in the original component
  const endAngle = startAngle + (fullAngle * percentage) / 100;

  // Determine the fill color based on how close the consumed calories are to the goal
  const caloriesDifference = Math.abs(caloriesConsumed - caloriesGoal);
  let fillColor;
  if (caloriesDifference <= 200) {
    fillColor = "hsl(var(--chart-2))";
  } else if (caloriesConsumed < caloriesGoal) {
    fillColor = "hsl(var(--chart-3))";
  } else {
    fillColor = "hsl(var(--chart-8))";
  }

  const data = [
    {
      name: "Calories",
      value: 100, // Always set to 100 to fill the entire progress bar
      fill: fillColor,
    },
  ];

  return (
    <Card className="flex flex-col border-none">
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-square h-[250px]"
        >
          <RadialBarChart
            data={data}
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {caloriesConsumed.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {goal? `/${goal.calories} Calories` : "Calories"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
