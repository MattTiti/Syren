"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Intro({ customization, handleCustomizationChange }) {
  return (
    <AccordionItem value="intro">
      <AccordionTrigger>Introduction</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="intro">Custom introduction text:</Label>
            <Label className="text-neutral-500">
              <span
                className={`${
                  customization.intro.text.length > 160
                    ? "text-red-500"
                    : "text-green-700"
                }`}
              >
                {customization.intro.text.length}
              </span>
              /160
            </Label>
          </div>
          <Input
            id="intro"
            value={customization.intro.text}
            onChange={(e) =>
              handleCustomizationChange("intro", "text", e.target.value)
            }
            placeholder="Enter your custom intro text"
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
