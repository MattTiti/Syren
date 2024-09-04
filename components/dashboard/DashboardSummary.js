import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
import { toast } from "react-hot-toast";
import axios from "axios";
import { CircularProgress } from "../CircularProgress";
import { Progress } from "@/components/ui/progress";
import { DatePicker } from "@/components/DatePicker";
import Spinner from "../Spinner";
import { Checkbox } from "@/components/ui/checkbox";

const DashboardSummary = ({
  setGoal,
  goal,
  meals,
  selectedDay,
  setSelectedDay,
  userId,
  loading,
}) => {
  const [open, setOpen] = useState(false);
  const [isDefaultGoal, setIsDefaultGoal] = useState(false);
  const [localGoal, setLocalGoal] = useState(goal);

  useEffect(() => {
    setLocalGoal(goal);
  }, [goal]);

  // Calculate total macros from meals using useMemo
  const totalMacros = useMemo(() => {
    return meals.reduce(
      (acc, meal) => {
        meal.foods.forEach((food) => {
          acc.calories += Number(food.calories) || 0;
          acc.protein += Number(food.protein) || 0;
          acc.carbs += Number(food.carbs) || 0;
          acc.fat += Number(food.fat) || 0;
        });
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  // Calculate percentages using useMemo
  const percentages = useMemo(() => {
    return {
      calories: (totalMacros.calories / goal.calories) * 100,
      protein: (totalMacros.protein / goal.protein) * 100,
      carbs: (totalMacros.carbs / goal.carbs) * 100,
      fat: (totalMacros.fat / goal.fat) * 100,
    };
  }, [totalMacros, goal]);

  const chartData = useMemo(
    () => [
      {
        calories: "Calories",
        value: totalMacros.calories,
        fill: "var(--color-safari)",
      },
    ],
    [totalMacros.calories]
  );

  const handleDateChange = (newDate) => {
    setSelectedDay(newDate);
  };

  const handleSaveGoal = async () => {
    try {
      await axios.put("/api/meals", {
        userId,
        date: selectedDay,
        goal: localGoal,
        meals,
      });

      if (isDefaultGoal) {
        await axios.put("/api/default", {
          defaultGoal: localGoal,
        });
      }

      setGoal(localGoal);
      toast.success("Goal saved successfully!");
    } catch (error) {
      console.error("Error saving goal:", error);
      toast.error("Error saving goal");
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 lg:col-span-2">
      <Card className="sm:col-span-4">
        <CardHeader className="p-4 pb-0"></CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Spinner />
            </div>
          ) : (
            <div className="flex items-start">
              <CircularProgress chartData={chartData} goal={goal} />
              <div className="mx-6 space-y-3 w-full">
                <div className="flex justify-end">
                  <div>
                    <DatePicker
                      className="w-[280px]"
                      selected={selectedDay}
                      onDateChange={handleDateChange}
                    />
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="ml-4">
                          Set Macro Goal
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Set Macro Goal</DialogTitle>
                          <DialogDescription>
                            Set your macro goals for the day
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <Input
                            type="number"
                            value={localGoal.calories}
                            onChange={(e) =>
                              setLocalGoal({
                                ...localGoal,
                                calories: parseInt(e.target.value),
                              })
                            }
                            placeholder="Calories"
                          />
                          <Input
                            type="number"
                            value={localGoal.protein}
                            onChange={(e) =>
                              setLocalGoal({
                                ...localGoal,
                                protein: parseInt(e.target.value),
                              })
                            }
                            placeholder="Protein"
                          />
                          <Input
                            type="number"
                            value={localGoal.carbs}
                            onChange={(e) =>
                              setLocalGoal({
                                ...localGoal,
                                carbs: parseInt(e.target.value),
                              })
                            }
                            placeholder="Carbs"
                          />
                          <Input
                            type="number"
                            value={localGoal.fat}
                            onChange={(e) =>
                              setLocalGoal({
                                ...localGoal,
                                fat: parseInt(e.target.value),
                              })
                            }
                            placeholder="Fat"
                          />
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <Checkbox
                            id="default-goal"
                            checked={isDefaultGoal}
                            onCheckedChange={setIsDefaultGoal}
                          />
                          <label
                            htmlFor="default-goal"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Set as default goal
                          </label>
                        </div>
                        <Button onClick={handleSaveGoal} className="mt-4">
                          Save Goal
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Protein
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {totalMacros.protein}/{goal.protein}g
                    </span>
                  </div>
                  <Progress
                    value={percentages.protein}
                    color="bg-green-500"
                    label={`${totalMacros.protein}/${goal.protein}g`}
                  />
                </div>
                <div className="flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Carbs</span>
                    <span className="text-sm text-muted-foreground">
                      {totalMacros.carbs}/{goal.carbs}g
                    </span>
                  </div>
                  <Progress
                    value={percentages.carbs}
                    color="bg-yellow-500"
                    label={`${totalMacros.carbs}/${goal.carbs}g`}
                  />
                </div>
                <div className="flex-col justify-between">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fat</span>
                    <span className="text-sm text-muted-foreground">
                      {totalMacros.fat}/{goal.fat}g
                    </span>
                  </div>
                  <Progress
                    value={percentages.fat}
                    color="bg-red-500"
                    label={`${totalMacros.fat}/${goal.fat}g`}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
