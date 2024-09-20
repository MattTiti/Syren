"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function Weather({ customization, handleCustomizationChange }) {
  return (
    <AccordionItem value="weather">
      <AccordionTrigger>Weather</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="weather"
              checked={customization.weather.enabled}
              onCheckedChange={(checked) =>
                handleCustomizationChange("weather", "enabled", checked)
              }
            />
            <Label htmlFor="weather">Include weather in your daily text</Label>
          </div>
          <div className="space-y-2">
            <Label>Weather location input type:</Label>
            <RadioGroup
              value={customization.weather.inputType}
              onValueChange={(value) =>
                handleCustomizationChange("weather", "inputType", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="city" id="city" />
                <Label htmlFor="city">City</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="coordinates" id="coordinates" />
                <Label htmlFor="coordinates">Latitude/Longitude</Label>
              </div>
            </RadioGroup>
          </div>
          {customization.weather.inputType === "city" ? (
            <div className="space-y-2">
              <Label htmlFor="city">City for weather information:</Label>
              <Input
                id="city"
                value={customization.weather.city}
                onChange={(e) =>
                  handleCustomizationChange("weather", "city", e.target.value)
                }
                placeholder="Enter your city"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Coordinates:</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="latitude"
                  value={customization.weather.latitude}
                  onChange={(e) =>
                    handleCustomizationChange(
                      "weather",
                      "latitude",
                      e.target.value
                    )
                  }
                  placeholder="Latitude"
                />
                <Input
                  id="longitude"
                  value={customization.weather.longitude}
                  onChange={(e) =>
                    handleCustomizationChange(
                      "weather",
                      "longitude",
                      e.target.value
                    )
                  }
                  placeholder="Longitude"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Temperature Units:</Label>
            <RadioGroup
              value={customization.weather.units}
              onValueChange={(value) =>
                handleCustomizationChange("weather", "units", value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="imperial" id="fahrenheit" />
                <Label htmlFor="fahrenheit">Fahrenheit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="metric" id="celsius" />
                <Label htmlFor="celsius">Celsius</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Additional weather information:</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weatherWind"
                  checked={customization.weather.showWind}
                  onCheckedChange={(checked) =>
                    handleCustomizationChange("weather", "showWind", checked)
                  }
                />
                <Label htmlFor="weatherWind">Include wind information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weatherRain"
                  checked={customization.weather.showRain}
                  onCheckedChange={(checked) =>
                    handleCustomizationChange("weather", "showRain", checked)
                  }
                />
                <Label htmlFor="weatherRain">Include rain information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weatherHumidity"
                  checked={customization.weather.showHumidity}
                  onCheckedChange={(checked) =>
                    handleCustomizationChange(
                      "weather",
                      "showHumidity",
                      checked
                    )
                  }
                />
                <Label htmlFor="weatherHumidity">
                  Include humidity information
                </Label>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
