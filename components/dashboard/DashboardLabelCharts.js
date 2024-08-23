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

const DashboardLabelCharts = ({ monthlyExpenses = [], selectedMonth }) => {
  const [selectedChart, setSelectedChart] = useState("pie");

  const spendingByLabel = useMemo(() => {
    const labelMap = {};

    monthlyExpenses?.forEach((row) => {
      const label = capitalizeFirstLetter(row.label) || "None";
      const cost = parseFloat(row.cost || 0);

      if (labelMap[label]) {
        labelMap[label] += cost;
      } else {
        labelMap[label] = cost;
      }
    });
    const customOrder = ["Green", "Yellow", "Red"];

    return Object.entries(labelMap)
      .map(([label, cost]) => ({
        label,
        cost,
        fill: `hsl(var(--color-${label.toLowerCase()}))`,
      }))
      .filter(({ label }) => label !== "None")
      .sort(
        (a, b) => customOrder.indexOf(a.label) - customOrder.indexOf(b.label)
      );
  }, [monthlyExpenses]);

  const highestLabel = spendingByLabel.reduce(
    (max, curr) => (curr.cost > max.cost ? curr : max),
    spendingByLabel[0] || { label: "N/A", cost: 0 }
  );

  const lowestLabel = spendingByLabel.reduce(
    (min, curr) => (curr.cost < min.cost ? curr : min),
    spendingByLabel[0] || { label: "N/A", cost: 0 }
  );

  const renderChart = () => {
    switch (selectedChart) {
      case "bar":
        return (
          <DashboardHorizontalBar data={spendingByLabel} dataKey="label" />
        );
      case "pie":
        return (
          <DashboardPieChart
            data={spendingByLabel}
            dataKey="cost"
            nameKey="label"
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
            <CardTitle>Spending by Label</CardTitle>
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
          Highest expense label — {highestLabel.label} (
          {formatCurrency(highestLabel.cost)})
        </div>
        <div className="leading-none text-muted-foreground">
          Lowest expense label — {lowestLabel.label} (
          {formatCurrency(lowestLabel.cost)})
        </div>
      </CardFooter>
    </Card>
  );
};

export default DashboardLabelCharts;
