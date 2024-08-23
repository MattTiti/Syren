import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  cost: {
    label: "Cost",
    color: "hsl(var(--chart-1))",
  },
};

const DashboardHorizontalBar = ({ data, dataKey }) => {
  return (
    <>
      {data.length === 0 || (data.length === 1 && data[0].cost === 0) ? (
        <div className="text-center text-sm text-muted-foreground p-24">
          No data available
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="my-2">
          <BarChart data={data} layout="vertical" margin={{ right: 16 }}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey={dataKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey={dataKey} />}
            />
            <XAxis type="number" hide />
            <Bar
              dataKey="cost"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey={dataKey === "label" ? "" : dataKey}
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
};

export default DashboardHorizontalBar;
