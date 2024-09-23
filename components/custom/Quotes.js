"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Quotes({ customization, handleCustomizationChange }) {
  return (
    <AccordionItem value="quotes">
      <AccordionTrigger>Quotes</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="quotes"
            checked={customization.quotes.enabled}
            onCheckedChange={(checked) =>
              handleCustomizationChange("quotes", "enabled", checked)
            }
          />
          <Label htmlFor="quotes">Include a random quote in your text</Label>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
