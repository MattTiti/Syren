import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ShoppingCart,
  Film,
  Utensils,
  Car,
  Home,
  CreditCard,
  Heart,
  Plane,
  MoreHorizontal,
} from "lucide-react";

const categories = [
  {
    value: "groceries",
    label: "Groceries",
    icon: ShoppingCart,
  },
  {
    value: "entertainment",
    label: "Entertainment",
    icon: Film,
  },
  {
    value: "dining",
    label: "Dining",
    icon: Utensils,
  },
  {
    value: "transportation",
    label: "Transportation",
    icon: Car,
  },
  {
    value: "housing",
    label: "Housing",
    icon: Home,
  },
  {
    value: "subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
  },
  {
    value: "health",
    label: "Health",
    icon: Heart,
  },
  {
    value: "vacation",
    label: "Vacation",
    icon: Plane,
  },
  {
    value: "other",
    label: "Other",
    icon: MoreHorizontal,
  },
];

export function CategoryCombobox({ selectedCategory, onCategoryChange }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedCategory || "");

  React.useEffect(() => {
    setValue(selectedCategory || "");
  }, [selectedCategory]);

  const handleSelect = (currentValue) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    onCategoryChange(newValue);
    setOpen(false);
  };

  const findCategory = (value) => {
    return (
      categories.find((category) => category.value === value) || {
        value: "other",
        label: "Other",
        icon: MoreHorizontal,
      }
    );
  };

  const selectedCategoryData = findCategory(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-muted-foreground"
        >
          {value ? (
            <div className="flex items-center">
              <selectedCategoryData.icon className="mr-2 h-4 w-4" />
              {selectedCategoryData.label}
            </div>
          ) : (
            "Select category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={() => handleSelect(category.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <category.icon className="mr-2 h-4 w-4" />
                  {category.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
