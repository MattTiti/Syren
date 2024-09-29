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
import { Combobox } from "@/components/ui/combobox";

export default function News({ customization, handleCustomizationChange }) {
  return (
    <AccordionItem value="news">
      <AccordionTrigger>News</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="news"
              checked={customization.news.enabled}
              onCheckedChange={(checked) =>
                handleCustomizationChange("news", "enabled", checked)
              }
            />
            <Label htmlFor="news">Include news in your daily text</Label>
          </div>
          <RadioGroup
            value={customization.news.type}
            onValueChange={(value) =>
              handleCustomizationChange("news", "type", value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="topHeadlines" id="topHeadlines" />
              <Label htmlFor="topHeadlines">Top Headlines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="customSearch" id="customSearch" />
              <Label htmlFor="customSearch">Custom Search</Label>
            </div>
          </RadioGroup>
          {customization.news.type === "topHeadlines" && (
            <Combobox
              options={[
                { value: "general", label: "General" },
                { value: "business", label: "Business" },
                { value: "technology", label: "Technology" },
                { value: "sports", label: "Sports" },
                { value: "entertainment", label: "Entertainment" },
                { value: "health", label: "Health" },
                { value: "science", label: "Science" },
              ]}
              value={customization.news.topic}
              onValueChange={(value) =>
                handleCustomizationChange("news", "topic", value)
              }
            />
          )}
          {customization.news.type === "customSearch" && (
            <div className="space-y-2">
              <Label htmlFor="customQuery">Custom search query:</Label>
              <Input
                id="customQuery"
                value={customization.news.customQuery}
                onChange={(e) =>
                  handleCustomizationChange(
                    "news",
                    "customQuery",
                    e.target.value
                  )
                }
                placeholder="Enter your custom search query"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeLinks"
              checked={customization.news.includeLinks}
              onCheckedChange={(checked) =>
                handleCustomizationChange("news", "includeLinks", checked)
              }
            />
            <Label htmlFor="includeLinks">Include links to news articles</Label>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
