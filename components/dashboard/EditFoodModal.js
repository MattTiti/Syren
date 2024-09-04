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

const EditFoodModal = ({ isOpen, onClose, food, onSave }) => {
  const [editedFood, setEditedFood] = useState(food);

  useEffect(() => {
    if (isOpen) {
      setEditedFood(food);
    }
  }, [isOpen, food]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFood((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedFood);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Food</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="editFoodName"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Food Name
            </label>
            <Input
              id="editFoodName"
              placeholder="Food Name"
              name="name"
              value={editedFood.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="editCalories"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Calories
            </label>
            <Input
              id="editCalories"
              placeholder="Calories"
              name="calories"
              value={editedFood.calories}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="editProtein"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Protein (g)
            </label>
            <Input
              id="editProtein"
              placeholder="Protein (g)"
              name="protein"
              value={editedFood.protein}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="editCarbs"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Carbs (g)
            </label>
            <Input
              id="editCarbs"
              placeholder="Carbs (g)"
              name="carbs"
              value={editedFood.carbs}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="editFat"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Fat (g)
            </label>
            <Input
              id="editFat"
              placeholder="Fat (g)"
              name="fat"
              value={editedFood.fat}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <Button onClick={handleSave} className="mt-4">
          <CirclePlus size={16} className="mr-1" /> Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditFoodModal;
