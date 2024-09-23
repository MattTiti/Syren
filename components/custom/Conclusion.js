"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Conclusion({
  customization,
  handleCustomizationChange,
}) {
  return (
    <AccordionItem value="conclusion">
      <AccordionTrigger>Conclusion</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="conclusion">Custom conclusion text:</Label>
            <Label className="text-neutral-500">
              <span
                className={`${
                  customization.conclusion.text.length > 160
                    ? "text-red-500"
                    : "text-green-700"
                }`}
              >
                {customization.conclusion.text.length}
              </span>{" "}
              / 160
            </Label>
          </div>
          <Input
            id="conclusion"
            value={customization.conclusion.text}
            onChange={(e) =>
              handleCustomizationChange("conclusion", "text", e.target.value)
            }
            placeholder="Enter your custom conclusion text"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
