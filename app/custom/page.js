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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/utils";
import ButtonAccount from "@/components/ButtonAccount";
import Image from "next/image";
import config from "@/config";
import Link from "next/link";
import logo from "@/app/icon.png";
import { COUNTRIES } from "@/libs/constants";
import { Combobox } from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomizationPage() {
  const [customization, setCustomization] = useState({
    intro: {
      text: "Good morning!",
    },
    news: {
      enabled: false,
      type: "topHeadlines",
      topic: "technology",
      customQuery: "",
    },
    weather: {
      enabled: true,
      inputType: "city",
      city: "",
      latitude: "",
      longitude: "",
      showWind: false,
      showRain: false,
      showHumidity: false,
      units: "imperial", // Add this line (imperial for Fahrenheit, metric for Celsius)
    },
    sports: {
      enabled: false,
      league: "",
      teamId: "", // Changed from 'team' to 'teamId' for clarity
      teamName: "",
      showPreviousGame: false,
      showNextGame: false,
    },
    quotes: {
      enabled: true,
    },
    events: {
      enabled: false,
      country: "US",
    },
    conclusion: {
      text: "Have a great day!",
    },
    messaging: {
      enabled: true,
      consentGiven: false,
    },
  });
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("07:00"); // Default to 7:00 AM

  useEffect(() => {
    loadCustomization();
  }, []);

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (customization.sports.league) {
      setIsLoading(true);
      fetchTeams(customization.sports.league);
      setIsLoading(false);
    } else {
      setTeams([]);
    }
  }, [customization.sports.league]);

  const fetchLeagues = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/leagues");
      const data = await response.json();
      setLeagues(data.leagues);
    } catch (error) {
      console.error("Failed to fetch leagues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async (league) => {
    try {
      setLoadingTeams(true);
      const response = await fetch(
        `/api/teams?league=${encodeURIComponent(league)}`
      );
      const data = await response.json();
      setTeams(data.teams);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleCustomizationChange = (section, field, value) => {
    setCustomization((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // If changing to coordinates input, clear city
    if (
      section === "weather" &&
      field === "inputType" &&
      value === "coordinates"
    ) {
      setCustomization((prev) => ({
        ...prev,
        weather: {
          ...prev.weather,
          city: "",
        },
      }));
    }
  };

  const handleTeamChange = (selectedTeamId) => {
    const selectedTeam = teams.find((team) => team.idTeam === selectedTeamId);
    setCustomization((prev) => ({
      ...prev,
      sports: {
        ...prev.sports,
        teamId: selectedTeamId,
        teamName: selectedTeam ? selectedTeam.strTeam : "",
      },
    }));
  };

  const loadCustomization = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/customization`);
      if (response.ok) {
        const data = await response.json();
        setCustomization((prevState) => ({
          ...prevState,
          ...data.customization,
        }));
        setPhoneNumber(data.phoneNumber || "");
        setDeliveryTime(data.deliveryTime || "07:00");
      }
    } catch (error) {
      console.error("Error loading customization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomization = async () => {
    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }
    if (
      customization.messaging.enabled &&
      !customization.messaging.consentGiven
    ) {
      toast.error(
        "Please give consent to receive messages or disable messaging"
      );
      return;
    }
    if (customization.intro.text.length > 160) {
      toast.error("Introduction text cannot be longer than 160 characters");
      return;
    }
    if (customization.conclusion.text.length > 160) {
      toast.error("Conclusion text cannot be longer than 160 characters");
      return;
    }

    // Check and convert city to coordinates if necessary
    if (
      customization.weather.inputType === "city" &&
      customization.weather.city
    ) {
      try {
        const response = await fetch(
          `/api/coordinates?city=${encodeURIComponent(
            customization.weather.city
          )}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setCustomization((prev) => ({
            ...prev,
            weather: {
              ...prev.weather,
              latitude: data[0].lat.toString(),
              longitude: data[0].lon.toString(),
            },
          }));
        } else {
          toast.error("City not found. Please enter a valid city name.");
          return;
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        toast.error("Failed to fetch coordinates. Please try again.");
        return;
      }
    }

    try {
      const response = await fetch("/api/customization", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customization, phoneNumber, deliveryTime }),
      });

      if (response.ok) {
        toast.success("Changes saved!");
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const previewText = (
    <div className="space-y-4">
      {customization.intro.text && <p>{customization.intro.text}</p>}
      {customization.news.enabled &&
        customization.news.type === "topHeadlines" && (
          <div>
            <h3 className="font-semibold">
              {capitalizeFirstLetter(customization.news.topic)} News:
            </h3>
            <p>
              * GoodMornin launches new feature!{" "}
              <span className="text-blue-500 underline">
                https://tinyurl.com/goodmornin
              </span>
            </p>
            <p>
              * GoodMornin reaches 1000 users!{" "}
              <span className="text-blue-500 underline">
                https://tinyurl.com/goodmornin
              </span>
            </p>
            <p>
              * GoodMornin helps you get your day started!{" "}
              <span className="text-blue-500 underline">
                https://tinyurl.com/goodmornin
              </span>
            </p>
          </div>
        )}
      {customization.news.enabled &&
        customization.news.type === "customSearch" && (
          <div>
            <h3 className="font-semibold">
              {customization.news.customQuery} News:
            </h3>
            <p>
              * Latest Article on {customization.news.customQuery}{" "}
              <span className="text-blue-500 underline">
                https://tinyurl.com/goodmornin
              </span>
            </p>
          </div>
        )}
      {customization.weather.enabled && (
        <div>
          <h3 className="font-semibold">
            Weather in{" "}
            {customization.weather.inputType === "city"
              ? customization.weather.city || "[City]"
              : `[${customization.weather.latitude}, ${customization.weather.longitude}]` ||
                "[Coordinates]"}
            :
          </h3>
          <p>* There will be clear sky today</p>
          <p>* 72°F, feels like 68°F (60°F - 75°F)</p>
          {customization.weather.showWind && (
            <p>* 7 mph winds from the South (Gusts up to 10 mph)</p>
          )}
          {customization.weather.showRain && <p>* 12% chance of rain</p>}
          {customization.weather.showHumidity && <p>* 33% humidity</p>}
        </div>
      )}

      {customization.sports.enabled && customization.sports.teamId && (
        <div>
          <h3 className="font-semibold">
            {customization.sports.teamName} updates:
          </h3>
          {customization.sports.showPreviousGame && (
            <p>* Last game: {customization.sports.teamName} 2 - [Opponent] 1</p>
          )}
          {customization.sports.showNextGame && (
            <p>* Next game: Tomorrow 12:00 PM vs [Opponent]</p>
          )}
        </div>
      )}

      {customization.events.enabled && (
        <div>
          <h3 className="font-semibold">
            {COUNTRIES.find((c) => c.code === customization.events.country)
              ?.name || customization.events.country}{" "}
            Holidays:
          </h3>
          <p>* GoodMornin Appreciation Day!</p>
        </div>
      )}

      {customization.quotes.enabled && (
        <div>
          <h3 className="font-semibold">Quote of the day:</h3>
          <p>"He who indulges empty fears earns himself real fears." -Seneca</p>
        </div>
      )}

      {customization.conclusion.text && <p>{customization.conclusion.text}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col text-neutral-700">
      <nav className="sticky top-0 z-50 bg-yellow-50 shadow-sm">
        <div className="container flex items-center justify-between px-1 py-2 mx-auto">
          <Link
            className="flex items-center gap-2 shrink-0"
            href="/"
            title={`${config.appName} homepage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-12 h-12"
              placeholder="blur"
              priority={true}
              width={48}
              height={48}
            />
            <span className="font-semibold text-xl text-neutral-700">
              {config.appName}
            </span>
          </Link>
          <ButtonAccount />
        </div>
      </nav>
      <div className="flex">
        <div className="w-1/2 overflow-y-auto border-r border-neutral-200">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-neutral-700">
              Customize Your Daily Text
            </h1>

            <Accordion
              type="multiple"
              defaultValue={["settings"]}
              className="w-full"
            >
              <AccordionItem value="settings">
                <AccordionTrigger>Message Settings</AccordionTrigger>
                <AccordionContent className="px-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTime">Delivery Time (EST)</Label>
                      <Select
                        value={deliveryTime}
                        onValueChange={setDeliveryTime}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select delivery time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time} EST
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Enable Messaging:</Label>
                      <RadioGroup
                        value={
                          customization.messaging.enabled
                            ? "enabled"
                            : "disabled"
                        }
                        onValueChange={(value) =>
                          handleCustomizationChange(
                            "messaging",
                            "enabled",
                            value === "enabled"
                          )
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="enabled"
                            id="messaging-enabled"
                          />
                          <Label htmlFor="messaging-enabled">Enabled</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="disabled"
                            id="messaging-disabled"
                          />
                          <Label htmlFor="messaging-disabled">Disabled</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="consent"
                        checked={customization.messaging.consentGiven}
                        onCheckedChange={(checked) =>
                          handleCustomizationChange(
                            "messaging",
                            "consentGiven",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="consent">
                        I consent to receive SMS messages from GoodMornin.
                        Message and data rates may apply.
                      </Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

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
                        handleCustomizationChange(
                          "intro",
                          "text",
                          e.target.value
                        )
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
                        checked={customization.news.enabled}
                        onCheckedChange={(checked) =>
                          handleCustomizationChange("news", "enabled", checked)
                        }
                      />
                      <Label htmlFor="news">
                        Include news in your daily text
                      </Label>
                    </div>
                    <RadioGroup
                      value={customization.news.type}
                      onValueChange={(value) =>
                        handleCustomizationChange("news", "type", value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="topHeadlines"
                          id="topHeadlines"
                        />
                        <Label htmlFor="topHeadlines">Top Headlines</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="customSearch"
                          id="customSearch"
                        />
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
                        <Label htmlFor="customQuery">
                          Custom search query:
                        </Label>
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
                        checked={customization.weather.enabled}
                        onCheckedChange={(checked) =>
                          handleCustomizationChange(
                            "weather",
                            "enabled",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="weather">
                        Include weather in your daily text
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Weather location input type:</Label>
                      <RadioGroup
                        value={customization.weather.inputType}
                        onValueChange={(value) =>
                          handleCustomizationChange(
                            "weather",
                            "inputType",
                            value
                          )
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="city" id="city" />
                          <Label htmlFor="city">City</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="coordinates"
                            id="coordinates"
                          />
                          <Label htmlFor="coordinates">
                            Latitude/Longitude
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {customization.weather.inputType === "city" ? (
                      <div className="space-y-2">
                        <Label htmlFor="city">
                          City for weather information:
                        </Label>
                        <Input
                          id="city"
                          value={customization.weather.city}
                          onChange={(e) =>
                            handleCustomizationChange(
                              "weather",
                              "city",
                              e.target.value
                            )
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
                              handleCustomizationChange(
                                "weather",
                                "showWind",
                                checked
                              )
                            }
                          />
                          <Label htmlFor="weatherWind">
                            Include wind information
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="weatherRain"
                            checked={customization.weather.showRain}
                            onCheckedChange={(checked) =>
                              handleCustomizationChange(
                                "weather",
                                "showRain",
                                checked
                              )
                            }
                          />
                          <Label htmlFor="weatherRain">
                            Include rain information
                          </Label>
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
              <AccordionItem value="sports">
                <AccordionTrigger>Sports</AccordionTrigger>
                <AccordionContent className="px-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sports"
                        checked={customization.sports.enabled}
                        onCheckedChange={(checked) =>
                          handleCustomizationChange(
                            "sports",
                            "enabled",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="sports">
                        Include sports in your daily text
                      </Label>
                    </div>
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
                    <Combobox
                      options={teams.map((team) => ({
                        value: team.idTeam,
                        label: team.strTeam,
                      }))}
                      value={customization.sports.teamId}
                      onValueChange={handleTeamChange}
                      disabled={!customization.sports.league || loadingTeams}
                    />
                    <div className="space-y-2">
                      <Label>Game information:</Label>
                      <div className="flex flex-col space-y-2">
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
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
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
                    <Label htmlFor="quotes">
                      Include a random quote in your text
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="events">
                <AccordionTrigger>Holidays</AccordionTrigger>
                <AccordionContent className="px-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="events"
                        checked={customization.events.enabled}
                        onCheckedChange={(checked) =>
                          handleCustomizationChange(
                            "events",
                            "enabled",
                            checked
                          )
                        }
                      />
                      <Label htmlFor="events">
                        Include holidays in your daily text
                      </Label>
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
              <AccordionItem value="conclusion">
                <AccordionTrigger>Conclusion</AccordionTrigger>
                <AccordionContent className="px-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="conclusion">
                        Custom conclusion text:
                      </Label>
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
                        handleCustomizationChange(
                          "conclusion",
                          "text",
                          e.target.value
                        )
                      }
                      placeholder="Enter your custom conclusion text"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="w-1/2 p-6 sticky top-16 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Preview Text</h2>
            <Button
              className="p-3 group bg-white text-neutral-700 border border-yellow-500 hover:bg-neutral-100"
              onClick={saveCustomization}
            >
              Save Changes
            </Button>
          </div>
          <div className="bg-white border border-yellow-500 p-4 rounded-md">
            {isLoading ? <Spinner /> : previewText}
          </div>
        </div>
      </div>
    </div>
  );
}
