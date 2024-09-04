import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { CirclePlus } from "lucide-react";
import { toast } from "react-hot-toast";
import AddFoodModal from "./AddFoodModal";
import ResetModal from "./ResetModal";
import SmartAddModal from "./SmartAddModal";

const MealFooter = ({
  addRow,
  smartAddValue,
  setSmartAddValue,
  handleSmartAdd,
  loading,
  resetDialogOpen,
  setResetDialogOpen,
  handleReset,
  mealNum
}) => {
  const [mealOpen, setMealOpen] = useState(false);
  const [smartAddOpen, setSmartAddOpen] = useState(false);

  const handleAddFood = (newFood) => {
    addRow(newFood);
  };

  return (
    <CardFooter className="flex justify-between">
      <div className="flex gap-4">
        <Button type="button" onClick={() => setMealOpen(true)}>
          <CirclePlus size={16} className="mr-1" /> Add Food
        </Button>
        <AddFoodModal
          isOpen={mealOpen}
          onClose={() => setMealOpen(false)}
          onAddFood={handleAddFood}
        />

        <SmartAddModal
          isOpen={smartAddOpen}
          onOpenChange={setSmartAddOpen}
          value={smartAddValue}
          onChange={setSmartAddValue}
          onAdd={handleSmartAdd}
          loading={loading}
        />
      </div>
      <div className="flex gap-4">
        <ResetModal
          isOpen={resetDialogOpen}
          onOpenChange={setResetDialogOpen}
          onReset={handleReset}
          mealNum={mealNum}
        />
        <Button type="submit">Save</Button>
      </div>
    </CardFooter>
  );
};

export default MealFooter;
