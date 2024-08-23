import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardHorizontalBar from "./DashboardHorizontalBar";
import DashboardPieChart from "./DashboardPieChart";
import { capitalizeFirstLetter, formatCurrency } from "@/lib/utils";

const DashboardMonthlyCharts = ({ monthlyExpenses = [], selectedMonth }) => {
  const [selectedChart, setSelectedChart] = useState("pie");

  const spendingByCategory = useMemo(() => {
    const categoryMap = {};

    monthlyExpenses?.forEach((row) => {
      const category = capitalizeFirstLetter(row.category) || "Other";
      const cost = parseFloat(row.cost || 0);

      if (categoryMap[category]) {
        categoryMap[category] += cost;
      } else {
        categoryMap[category] = cost;
      }
    });

    return Object.entries(categoryMap).map(([category, cost]) => ({
      category,
      cost,
      fill: `hsl(var(--color-${category.toLowerCase()}))`,
    }));
  }, [monthlyExpenses]);

  const highestCategory = spendingByCategory.reduce(
    (max, curr) => (curr.cost > max.cost ? curr : max),
    spendingByCategory[0] || { category: "N/A", cost: 0 }
  );

  const lowestCategory = spendingByCategory.reduce(
    (min, curr) => (curr.cost < min.cost ? curr : min),
    spendingByCategory[0] || { category: "N/A", cost: 0 }
  );

  const renderChart = () => {
    switch (selectedChart) {
      case "bar":
        return (
          <DashboardHorizontalBar
            data={spendingByCategory}
            dataKey="category"
          />
        );
      case "pie":
        return (
          <DashboardPieChart
            data={spendingByCategory}
            dataKey="cost"
            nameKey="category"
            totalLabel="Total Spending"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div className="flex w-full justify-between">
          <div>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              {capitalizeFirstLetter(selectedMonth)} 2024
            </CardDescription>
          </div>
          <Select onValueChange={setSelectedChart} value={selectedChart}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Select Chart" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="pie">Pie</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">{renderChart()}</CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Highest expense category — {highestCategory.category} (
          {formatCurrency(highestCategory.cost)})
        </div>
        <div className="leading-none text-muted-foreground">
          Lowest expense category — {lowestCategory.category} (
          {formatCurrency(lowestCategory.cost)})
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardMonthlyCharts;
