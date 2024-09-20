"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Facts({ customization, handleCustomizationChange }) {
  return (
    <AccordionItem value="randomFact">
      <AccordionTrigger>Random Facts</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="randomFact"
              checked={customization.randomFact.enabled}
              onCheckedChange={(checked) =>
                handleCustomizationChange("randomFact", "enabled", checked)
              }
            />
            <Label htmlFor="randomFact">
              Include a random fact in your daily message
            </Label>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
