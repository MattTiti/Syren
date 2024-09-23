"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function OnThisDay({
  customization,
  handleCustomizationChange,
}) {
  return (
    <AccordionItem value="onThisDay">
      <AccordionTrigger>On This Day</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="onThisDay"
            checked={customization.onThisDay.enabled}
            onCheckedChange={(checked) =>
              handleCustomizationChange("onThisDay", "enabled", checked)
            }
          />
          <Label htmlFor="onThisDay">
            Include historical events that occurred on this day
          </Label>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
