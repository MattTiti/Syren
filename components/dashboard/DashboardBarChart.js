import { BarChart, Bar, CartesianGrid, XAxis, Cell, LabelList } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalizeFirstLetter, formatCurrency } from "@/lib/utils";

const DashboardBarChart = ({ data, selectedMonth, chartConfig }) => {
  return (
    <>
      {data.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground p-24">
          No data available
        </div>
      ) : (
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Bar dataKey="totalSpending" radius={8}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.month === capitalizeFirstLetter(selectedMonth)
                      ? "hsl(var(--chart-2))" // Highlighted color for selected month
                      : "hsl(var(--chart-1))" // Default color
                  }
                />
              ))}
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => formatCurrency(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
};

export default DashboardBarChart;
