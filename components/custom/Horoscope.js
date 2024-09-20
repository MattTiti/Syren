"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Horoscope({
  customization,
  handleCustomizationChange,
}) {
  const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  return (
    <AccordionItem value="horoscope">
      <AccordionTrigger>Horoscope</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="horoscope"
              checked={customization.horoscope.enabled}
              onCheckedChange={(checked) =>
                handleCustomizationChange("horoscope", "enabled", checked)
              }
            />
            <Label htmlFor="horoscope">
              Include daily horoscope in your text
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zodiacSign">Select your zodiac sign:</Label>
            <Select
              value={customization.horoscope.sign}
              onValueChange={(value) =>
                handleCustomizationChange("horoscope", "sign", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select zodiac sign" />
              </SelectTrigger>
              <SelectContent>
                {zodiacSigns.map((sign) => (
                  <SelectItem key={sign} value={sign.toLowerCase()}>
                    {sign}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
