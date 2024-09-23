"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { COUNTRIES } from "@/libs/constants";

export default function Holidays({ customization, handleCustomizationChange }) {
  return (
    <AccordionItem value="events">
      <AccordionTrigger>Holidays</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="events"
              checked={customization.events.enabled}
              onCheckedChange={(checked) =>
                handleCustomizationChange("events", "enabled", checked)
              }
            />
            <Label htmlFor="events">Include holidays in your daily text</Label>
          </div>
          <Combobox
            options={COUNTRIES.map((country) => ({
              value: country.code,
              label: country.name,
            }))}
            value={customization.events.country}
            onValueChange={(value) =>
              handleCustomizationChange("events", "country", value)
            }
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
