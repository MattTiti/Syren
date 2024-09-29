"use client";

import { useState, useEffect } from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { X, PlusCircle } from "lucide-react";

export default function Sports({
  customization,
  handleCustomizationChange,
  leagues,
  teams,
  loadingTeams,
  handleTeamChange,
}) {
  const [recapTeams, setRecapTeams] = useState(
    customization.sports.recapTeams || []
  );

  useEffect(() => {
    setRecapTeams(customization.sports.recapTeams || []);
  }, [customization.sports.recapTeams]);

  const addRecapTeam = () => {
    setRecapTeams([...recapTeams, ""]);
  };

  const removeRecapTeam = (index) => {
    const newRecapTeams = recapTeams.filter((_, i) => i !== index);
    setRecapTeams(newRecapTeams);
    handleCustomizationChange("sports", "recapTeams", newRecapTeams);
  };

  const handleRecapTeamChange = (index, value) => {
    const newRecapTeams = [...recapTeams];
    newRecapTeams[index] = value;
    setRecapTeams(newRecapTeams);
    handleCustomizationChange("sports", "recapTeams", newRecapTeams);
  };

  return (
    <AccordionItem value="sports">
      <AccordionTrigger>Sports</AccordionTrigger>
      <AccordionContent className="px-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sports"
              checked={customization.sports.enabled}
              onCheckedChange={(checked) =>
                handleCustomizationChange("sports", "enabled", checked)
              }
            />
            <Label htmlFor="sports">Include sports in your daily text</Label>
          </div>

          <RadioGroup
            value={customization.sports.type}
            onValueChange={(value) =>
              handleCustomizationChange("sports", "type", value)
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="team" id="team" />
              <Label htmlFor="team">One Team</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="league" id="league" />
              <Label htmlFor="league">League Recap</Label>
            </div>
          </RadioGroup>

          <Combobox
            options={leagues.map((league) => ({
              value: league.strLeague,
              label: league.strLeague,
            }))}
            value={customization.sports.league}
            onValueChange={(value) =>
              handleCustomizationChange("sports", "league", value)
            }
          />

          {customization.sports.type === "team" && (
            <Combobox
              options={teams.map((team) => ({
                value: team.idTeam,
                label: team.strTeam,
              }))}
              value={customization.sports.teamId}
              onValueChange={handleTeamChange}
              disabled={!customization.sports.league || loadingTeams}
            />
          )}

          {customization.sports.type === "league" && (
            <div className="space-y-2 flex flex-col">
              <Label>Teams to include:</Label>
              {recapTeams.map((team, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Combobox
                    options={teams.map((team) => ({
                      value: team.strTeam,
                      label: team.strTeam,
                    }))}
                    value={team}
                    onValueChange={(value) =>
                      handleRecapTeamChange(index, value)
                    }
                    disabled={!customization.sports.league || loadingTeams}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeRecapTeam(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={addRecapTeam}
                variant="outline"
                className="w-1/4"
              >
                <PlusCircle className="h-4 w-4 mr-1 " /> Add Team
              </Button>
            </div>
          )}
          {customization.sports.type === "team" && (
            <div className="space-y-2">
              <Label>Game information:</Label>
              <div className="flex flex-col space-y-2">
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sportsPreviousGame"
                      checked={customization.sports.showPreviousGame}
                      onCheckedChange={(checked) =>
                        handleCustomizationChange(
                          "sports",
                          "showPreviousGame",
                          checked
                        )
                      }
                    />
                    <Label htmlFor="sportsPreviousGame">
                      Include last game result
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sportsNextGame"
                      checked={customization.sports.showNextGame}
                      onCheckedChange={(checked) =>
                        handleCustomizationChange(
                          "sports",
                          "showNextGame",
                          checked
                        )
                      }
                    />
                    <Label htmlFor="sportsNextGame">
                      Include next game schedule
                    </Label>
                  </div>
                </>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
