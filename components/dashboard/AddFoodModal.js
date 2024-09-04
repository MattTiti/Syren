import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

const AddFoodModal = ({ isOpen, onClose, onAddFood }) => {
  const [activeTab, setActiveTab] = useState("manual");
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [savedFoods, setSavedFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === "saved") {
      fetchSavedFoods();
    }
  }, [isOpen, activeTab]);

  const fetchSavedFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/foods");
      setSavedFoods(response.data.foods);
    } catch (error) {
      console.error("Error fetching saved foods:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = () => {
    if (mealName && calories && protein && carbs && fat) {
      const food = {
        name: mealName,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
      };

      const quantityNum = Math.max(1, Math.round(Number(quantity)));

      const foodsToAdd = Array(quantityNum).fill(food);

      // Add all foods at once
      onAddFood(foodsToAdd);

      resetForm();
      onClose();
      toast.success(
        `Added ${quantityNum} ${
          quantityNum > 1 ? "servings" : "serving"
        } of ${mealName}`
      );
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleAddSavedFood = (food) => {
    onAddFood({
      name: food.name.toString(),
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      carbs: food.carbs.toString(),
      fat: food.fat.toString(),
    });
    toast.success(`${food.name.toString()} added!`);
  };

  const resetForm = () => {
    setMealName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setQuantity("1");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] sm:max-h-[650px]">
        <DialogHeader>
          <DialogTitle>Add Food</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="saved">Saved Foods</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <div className="space-y-4 mt-4">
              <div>
                <label
                  htmlFor="foodName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Food Name
                </label>
                <Input
                  id="foodName"
                  placeholder="e.g., Chicken Breast"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Quantity (servings)
                </label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <label
                  htmlFor="calories"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Calories
                </label>
                <Input
                  id="calories"
                  placeholder="e.g., 165"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="protein"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Protein (g)
                </label>
                <Input
                  id="protein"
                  placeholder="e.g., 31"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="carbs"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Carbs (g)
                </label>
                <Input
                  id="carbs"
                  placeholder="e.g., 0"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="fat"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Fat (g)
                </label>
                <Input
                  id="fat"
                  placeholder="e.g., 3.6"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Button onClick={handleAddFood} className="mt-4 w-full">
                <CirclePlus size={16} className="mr-1" /> Add
              </Button>
            </div>
          </TabsContent>
          <TabsContent
            value="saved"
            className="h-full overflow-y-auto sm:max-h-[400px]"
          >
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-4 mt-4 h-full px-4">
                {savedFoods.map((food) => (
                  <div
                    key={food.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-sm text-gray-500">
                        {food.calories} cal | {food.protein}g P | {food.carbs}g
                        C | {food.fat}g F
                      </p>
                    </div>
                    <Button
                      onClick={() => handleAddSavedFood(food)}
                      size="sm"
                      className="px-2"
                    >
                      <CirclePlus size={20} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodModal;
