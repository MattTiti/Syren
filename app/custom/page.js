"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/utils";
import ButtonAccount from "@/components/ButtonAccount";

export default function CustomizationPage() {
  const [customization, setCustomization] = useState({
    intro: "Good morning!",
    news: true,
    newsTopic: "technology",
    weather: true,
    city: "",
    sports: false,
    quotes: true,
    selectedLeague: "",
    selectedTeam: "",
    conclusion: "Have a great day!",
  });
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (customization.selectedLeague) {
      fetchTeams(customization.selectedLeague);
    } else {
      setTeams([]);
    }
  }, [customization.selectedLeague]);

  const fetchLeagues = async () => {
    try {
      const response = await fetch("/api/leagues");
      const data = await response.json();
      setLeagues(data.leagues);
    } catch (error) {
      console.error("Failed to fetch leagues:", error);
    }
  };

  const fetchTeams = async (league) => {
    try {
      const response = await fetch(
        `/api/teams?league=${encodeURIComponent(league)}`
      );
      const data = await response.json();
      setTeams(data.teams);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  const handleCustomizationChange = (section, value) => {
    setCustomization((prev) => {
      const newState = { ...prev, [section]: value };
      if (section === "selectedLeague") {
        newState.selectedTeam = "";
      }
      return newState;
    });
  };

  const previewText = `
    ${customization.intro ? `${customization.intro}\n` : ""}
    ${
      customization.news
        ? `Today's top ${capitalizeFirstLetter(
            customization.newsTopic
          )} headlines: [News Headlines]`
        : ""
    }
    ${
      customization.weather
        ? `Weather in ${customization.city || "[City]"}`
        : ""
    }
    ${
      customization.sports && customization.selectedTeam
        ? `${customization.selectedTeam} won (98-87)!`
        : ""
    }
    ${
      customization.quotes
        ? `Quote of the day: "He who indulges empty fears earns himself real fears." -Seneca`
        : ""
    }
    ${customization.conclusion ? `\n${customization.conclusion}` : ""}
  `.trim();

  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-1/2 p-6 border-r">
        <h1 className="text-3xl font-bold mb-6">Customize Your Daily Text</h1>
        <Accordion type="multiple" collapsible className="w-full">
          <AccordionItem value="intro">
            <AccordionTrigger>Introduction</AccordionTrigger>
            <AccordionContent className="px-2">
              <div className="space-y-2">
                <Input
                  id="intro"
                  value={customization.intro}
                  onChange={(e) =>
                    handleCustomizationChange("intro", e.target.value)
                  }
                  placeholder="Enter your custom intro text"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="news">
            <AccordionTrigger>News</AccordionTrigger>
            <AccordionContent className="px-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="news"
                    checked={customization.news}
                    onCheckedChange={(checked) =>
                      handleCustomizationChange("news", checked)
                    }
                  />
                  <Label htmlFor="news">Include news in your daily text</Label>
                </div>
                {customization.news && (
                  <Select
                    value={customization.newsTopic}
                    onValueChange={(value) =>
                      handleCustomizationChange("newsTopic", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a news topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="weather">
            <AccordionTrigger>Weather</AccordionTrigger>
            <AccordionContent className="px-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="weather"
                    checked={customization.weather}
                    onCheckedChange={(checked) =>
                      handleCustomizationChange("weather", checked)
                    }
                  />
                  <Label htmlFor="weather">
                    Include weather in your daily text
                  </Label>
                </div>
                {customization.weather && (
                  <div className="space-y-2">
                    <Label htmlFor="city">City for weather information:</Label>
                    <Input
                      id="city"
                      value={customization.city}
                      onChange={(e) =>
                        handleCustomizationChange("city", e.target.value)
                      }
                      placeholder="Enter your city"
                    />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sports">
            <AccordionTrigger>Sports</AccordionTrigger>
            <AccordionContent className="px-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sports"
                    checked={customization.sports}
                    onCheckedChange={(checked) =>
                      handleCustomizationChange("sports", checked)
                    }
                  />
                  <Label htmlFor="sports">
                    Include sports in your daily text
                  </Label>
                </div>
                {customization.sports && (
                  <>
                    <Select
                      value={customization.selectedLeague}
                      onValueChange={(value) =>
                        handleCustomizationChange("selectedLeague", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a league" />
                      </SelectTrigger>
                      <SelectContent>
                        {leagues.map((league) => (
                          <SelectItem
                            key={league.idLeague}
                            value={league.strLeague}
                          >
                            {league.strLeague}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {customization.selectedLeague && (
                      <Select
                        value={customization.selectedTeam}
                        onValueChange={(value) =>
                          handleCustomizationChange("selectedTeam", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.idTeam} value={team.strTeam}>
                              {team.strTeam}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="quotes">
            <AccordionTrigger>Quotes</AccordionTrigger>
            <AccordionContent className="px-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="quotes"
                  checked={customization.quotes}
                  onCheckedChange={(checked) =>
                    handleCustomizationChange("quotes", checked)
                  }
                />
                <Label htmlFor="quotes">Include daily quote in your text</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="conclusion">
            <AccordionTrigger>Conclusion</AccordionTrigger>
            <AccordionContent className="px-2">
              <div className="space-y-2">
                <Label htmlFor="conclusion">Custom conclusion text:</Label>
                <Input
                  id="conclusion"
                  value={customization.conclusion}
                  onChange={(e) =>
                    handleCustomizationChange("conclusion", e.target.value)
                  }
                  placeholder="Enter your custom conclusion text"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="w-1/2 p-6 sticky top-0 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Preview Text</h2>
          <ButtonAccount />
        </div>
        <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
          {previewText}
        </div>
        <div className="flex justify-end mt-4">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
