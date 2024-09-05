import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [savedFoodsSearchTerm, setSavedFoodsSearchTerm] = useState("");
  const [verifiedFoodsLoading, setVerifiedFoodsLoading] = useState(false);
  const [verifiedFoods, setVerifiedFoods] = useState([]);

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
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
      };

      const quantityNum = Math.max(1, Math.round(Number(quantity)));

      const foodsToAdd = Array(quantityNum).fill(food);

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
    setSearchTerm("");
    setSavedFoodsSearchTerm("");
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    setVerifiedFoodsLoading(true);
    try {
      const response = await axios.get("/api/search", {
        params: { query: searchTerm },
      });

      if (response.data.foods && response.data.foods.food) {
        setVerifiedFoods(response.data.foods.food);
        console.log(response.data.foods.food);
      } else {
        setVerifiedFoods([]);
        console.log("No foods found");
      }
    } catch (error) {
      console.error("Error searching foods:", error);
      toast.error("Error searching foods");
    } finally {
      setVerifiedFoodsLoading(false);
    }
  };

  const extractMacros = (description) => {
    const macroRegex =
      /Calories: (\d+)kcal \| Fat: ([\d.]+)g \| Carbs: ([\d.]+)g \| Protein: ([\d.]+)g/;
    const match = description.match(macroRegex);

    if (match) {
      return {
        calories: parseInt(match[1], 10),
        fat: parseFloat(match[2]),
        carbs: parseFloat(match[3]),
        protein: parseFloat(match[4]),
      };
    }

    return null;
  };

  const handleAddVerifiedFood = (food) => {
    const macros = extractMacros(food.food_description);

    if (macros) {
      const newFood = {
        name: food.food_name,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
      };

      onAddFood([newFood]);
      toast.success(`${food.food_name} added!`);
    } else {
      toast.error("Couldn't parse food information. Please add manually.");
    }
  };

  const filteredSavedFoods = useMemo(() => {
    return savedFoods.filter((food) =>
      food.name.toLowerCase().includes(savedFoodsSearchTerm.toLowerCase())
    );
  }, [savedFoods, savedFoodsSearchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] sm:max-h-[650px]">
        <DialogHeader>
          <DialogTitle>Add Food</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="saved">Saved Foods</TabsTrigger>
            <TabsTrigger value="verified">Verified Foods</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <div className="space-y-4 mt-4">
              <div>
                <label
                  htmlFor="foodName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Label
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
                  type="number"
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
          <TabsContent value="saved" className="sm:min-h-[400px]">
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Search saved foods..."
                value={savedFoodsSearchTerm}
                onChange={(e) => setSavedFoodsSearchTerm(e.target.value)}
              />
              {loading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-4 mt-4 h-full px-4 overflow-y-auto sm:max-h-[400px]">
                  {filteredSavedFoods.map((food) => (
                    <div
                      key={food.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-sm text-gray-500">
                          {food.calories} cal | {food.protein}g P | {food.carbs}
                          g C | {food.fat}g F
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
              {!filteredSavedFoods ||
                (filteredSavedFoods.length === 0 && (
                  <div className="flex justify-center items-center h-[400px]">
                    <p className="text-gray-500">No saved foods found</p>
                  </div>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="verified" className="sm:min-h-[400px]">
            <div className="space-y-4 mt-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search verified foods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="h-[300px] overflow-y-auto">
                {verifiedFoodsLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <Spinner />
                  </div>
                ) : (
                  <div className="space-y-4 mt-4">
                    {verifiedFoods.map((food) => (
                      <div
                        key={food.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{food.food_name}</p>
                          <p className="text-sm text-gray-500">
                            {food.food_description}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleAddVerifiedFood(food)}
                          size="sm"
                          className="px-2"
                        >
                          <CirclePlus size={20} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {!verifiedFoods ||
                  (verifiedFoods.length === 0 && (
                    <div className="flex justify-center items-center h-[300px]">
                      <p className="text-gray-500">No verified foods found</p>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodModal;
