import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "react-hot-toast";

const DemoDashboardSummary = ({ setBudget, budget, rows }) => {
  const [open, setOpen] = useState(false);

  // Calculate the total cost from the rows
  const totalCost = useMemo(() => {
    return rows.reduce((sum, row) => sum + parseFloat(row.cost || 0), 0);
  }, [rows]);

  // Format numbers as currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleSaveBudget = async () => {
    setOpen(false);
    toast.success("Budget saved successfully!");
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
      <Card className="sm:col-span-4" x-chunk="dashboard-05-chunk-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">
                {`${formatCurrency(totalCost)} / ${formatCurrency(budget)}`}
              </CardTitle>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="ml-4">
                  Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Monthly Budget</DialogTitle>
                  <DialogDescription>
                    Set your budget for the month
                  </DialogDescription>
                </DialogHeader>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter budget"
                  className="mt-4"
                />
                <Button onClick={handleSaveBudget} className="mt-4">
                  Save Budget
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {`${formatCurrency(budget - totalCost)} left`}
          </div>
        </CardContent>
        <CardFooter>
          <Progress
            value={totalCost > budget ? 100 : (totalCost / budget) * 100}
            aria-label="Progress"
            color={totalCost > budget ? "bg-red-500" : "bg-primary"}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default DemoDashboardSummary;
