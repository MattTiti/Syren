import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Spinner from "@/components/Spinner";
import MealFooter from "./MealFooter";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EditFoodModal from "./EditFoodModal";

const Meal = forwardRef(
  (
    {
      selectedDay,
      savedMeals,
      setSavedMeals,
      userId,
      loading,
      setLoading,
      setUpdate,
      update,
      mealNum,
    },
    ref
  ) => {
    const [smartAddValue, setSmartAddValue] = useState("");
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [foods, setFoods] = useState([]);
    const [editingFood, setEditingFood] = useState(null);
    const lastSavedMealsRef = useRef(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
      if (savedMeals && savedMeals[mealNum - 1]) {
        setFoods(savedMeals[mealNum - 1].foods || []);
      } else {
        setFoods([]);
      }
      setLoading(false);
      setHasUnsavedChanges(false);
    }, [savedMeals, mealNum]);

    useEffect(() => {
      const savedMeal = savedMeals[mealNum - 1];
      const savedFoods = savedMeal ? savedMeal.foods : [];
      setHasUnsavedChanges(
        JSON.stringify(foods) !== JSON.stringify(savedFoods)
      );
    }, [foods, savedMeals, mealNum]);

    const addFood = (newFoods) => {
      if (Array.isArray(newFoods)) {
        setFoods((prevFoods) => [...prevFoods, ...newFoods]);
      } else {
        setFoods((prevFoods) => [...prevFoods, newFoods]);
      }
    };

    const handleDeleteFood = (index) => {
      setFoods(foods.filter((_, i) => i !== index));
    };

    const handleDeleteMeal = () => {
      const updatedMeals = savedMeals.filter(
        (_, index) => index !== mealNum - 1
      );
      setSavedMeals(updatedMeals);
      setDeleteDialogOpen(false);
    };

    const handleSave = useCallback(
      async (mealsToSave) => {
        if (
          JSON.stringify(mealsToSave) ===
          JSON.stringify(lastSavedMealsRef.current)
        ) {
          return;
        }
        lastSavedMealsRef.current = mealsToSave;

        setLoading(true);

        try {
          const response = await axios.put("/api/meals", {
            userId,
            date: selectedDay,
            meals: mealsToSave,
          });

          toast.success("Meals saved successfully!");
          setSavedMeals(mealsToSave);
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error(
            "Error saving meals:",
            error.response?.data || error.message
          );
          toast.error("Error saving meals");
        } finally {
          setLoading(false);
          setUpdate(!update);
        }
      },
      [userId, selectedDay, setLoading, setUpdate, update, setSavedMeals]
    );

    const handleSubmit = useCallback(
      (e) => {
        e.preventDefault();
        const updatedMeals = savedMeals.map((meal, index) =>
          index === mealNum - 1 ? { foods } : meal
        );
        handleSave(updatedMeals);
      },
      [savedMeals, mealNum, foods, handleSave]
    );

    const handleSmartAdd = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/parse", {
          bankStatement: smartAddValue,
        });

        const newFoods = Array.isArray(response.data.foods)
          ? response.data.foods
          : [response.data.foods];

        const newMeals = [...foods, ...newFoods];

        const filteredMeals = newMeals.filter(
          (food) =>
            food.name.trim() !== "" ||
            food.calories.trim() !== "" ||
            food.protein.trim() !== "" ||
            food.carbs.trim() !== "" ||
            food.fat.trim() !== ""
        );

        try {
          const saveResponse = await axios.put("/api/meals", {
            userId,
            date: selectedDay,
            meals: filteredMeals,
          });

          toast.success("Meals saved successfully!");
        } catch (error) {
          toast.error("Error saving meals");
        } finally {
          setLoading(false);
          setUpdate(!update);
        }
        setOpen(false);
      } catch (error) {
        toast.error("Error using OpenAI to parse meals");
      } finally {
        setLoading(false);
        setSmartAddValue("");
      }
    };

    const handleReset = async () => {
      setFoods([]);
      try {
        const updatedMeals = savedMeals.map((meal, index) =>
          index === mealNum - 1 ? { foods: [] } : meal
        );

        const response = await axios.put("/api/meals", {
          userId,
          date: selectedDay,
          meals: updatedMeals,
        });

        setSavedMeals(updatedMeals);
        toast.success(`Meal ${mealNum} cleared successfully!`);
      } catch (error) {
        console.error("Error resetting meal:", error);
        toast.error(`Error resetting meal ${mealNum}`);
      } finally {
        setUpdate(!update);
        setResetDialogOpen(false);
      }
    };

    const handleEditFood = (food, index) => {
      setEditingFood({ ...food, index });
    };

    const handleSaveEditedFood = useCallback(
      (editedFood) => {
        setFoods((prevFoods) => {
          const updatedFoods = prevFoods.map((food, index) =>
            index === editedFood.index
              ? {
                  name: editedFood.name,
                  calories: editedFood.calories,
                  protein: editedFood.protein,
                  carbs: editedFood.carbs,
                  fat: editedFood.fat,
                }
              : food
          );

          const updatedMeals = savedMeals.map((meal, index) =>
            index === mealNum - 1 ? { foods: updatedFoods } : meal
          );

          handleSave(updatedMeals);

          return updatedFoods;
        });

        setEditingFood(null);
      },
      [savedMeals, mealNum, handleSave]
    );

    return (
      <form onSubmit={handleSubmit} className="lg:col-span-2">
        <Card ref={ref} className="sm:col-span-2">
          <CardHeader className="pb-2 flex justify-between items-start">
            <div className="flex w-full justify-between">
              <div className="flex flex-col">
                <CardTitle>Meal {mealNum}</CardTitle>
                <CardDescription className="flex flex-justify-between mt-2">
                  Enter food and save changes to see updated graphics
                </CardDescription>
              </div>
              <div className="flex flex-col items-end">
                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground -mt-2"
                      title="Delete Meal"
                    >
                      <FaTimes size={18} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Meal</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this meal? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteMeal}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {hasUnsavedChanges && (
                  <p className="text-sm text-yellow-500">Unsaved Changes</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Spinner />
            ) : (
              <div className="">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Food</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead>Protein</TableHead>
                      <TableHead>Carbs</TableHead>
                      <TableHead>Fat</TableHead>
                      <TableHead className="px-0"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foods.map((food, index) => (
                      <TableRow
                        key={index}
                        onClick={() => {
                          handleEditFood(food, index);
                        }}
                        className="cursor-pointer"
                      >
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {food.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {food.calories}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {food.protein}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {food.carbs}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {food.fat}
                          </div>
                        </TableCell>
                        <TableCell className="px-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFood(index);
                            }}
                          >
                            <FaTrash className="text-zinc-200" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <MealFooter
            addRow={addFood}
            open={open}
            setOpen={setOpen}
            smartAddValue={smartAddValue}
            setSmartAddValue={setSmartAddValue}
            handleSmartAdd={handleSmartAdd}
            loading={loading}
            resetDialogOpen={resetDialogOpen}
            setResetDialogOpen={setResetDialogOpen}
            handleReset={handleReset}
            mealNum={mealNum}
          />
        </Card>
        <EditFoodModal
          isOpen={!!editingFood}
          onClose={() => setEditingFood(null)}
          food={editingFood || {}}
          onSave={handleSaveEditedFood}
        />
      </form>
    );
  }
);

Meal.displayName = "Meal";

export default Meal;
