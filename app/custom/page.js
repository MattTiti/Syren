"use client";
import { useState, useEffect } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/lib/utils";
import { COUNTRIES } from "@/libs/constants";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import Intro from "@/components/custom/Intro";
import News from "@/components/custom/News";
import Weather from "@/components/custom/Weather";
import Settings from "@/components/custom/Settings";
import Sports from "@/components/custom/Sports";
import Holidays from "@/components/custom/Holidays";
import Horoscope from "@/components/custom/Horoscope";
import Quotes from "@/components/custom/Quotes";
import OnThisDay from "@/components/custom/OnThisDay";
import Facts from "@/components/custom/Facts";
import Conclusion from "@/components/custom/Conclusion";
import Nav from "@/components/custom/Nav";
import Email from "@/components/custom/Email";

export default function CustomizationPage() {
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [customization, setCustomization] = useState({
    intro: {
      text: "Good morning!",
    },
    news: {
      enabled: false,
      type: "topHeadlines",
      topic: "technology",
      customQuery: "",
      includeLinks: false, // Add this line
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
      showAirQuality: false, // Add this line
      airQualityOptions: {
        // Add this object
        co: false,
        no: false,
        no2: false,
        o3: false,
        so2: false,
        pm2_5: false,
        pm10: false,
        nh3: false,
      },
    },
    sports: {
      enabled: false,
      type: "team",
      league: "",
      teamId: "",
      teamName: "",
      showPreviousGame: false,
      showNextGame: false,
      recapTeams: [], // Keep this, remove showRecap
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
    horoscope: {
      enabled: false,
      sign: "",
    },
    onThisDay: {
      enabled: false,
    },
    randomFact: {
      enabled: false,
    },
    email: {
      enabled: false,
      consentGiven: false,
      address: "",
      deliveryTime: "07:00",
    },
  });
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("07:00"); // Default to 7:00 AM

  useEffect(() => {
    async function fetchUserAccess() {
      try {
        setUserLoading(true);
        const response = await fetch("/api/user-access");
        if (!response.ok) {
          throw new Error("Failed to fetch user access");
        }
        const data = await response.json();
        setUserHasAccess(data.userHasAccess);
      } catch (error) {
        console.error("Error fetching user access:", error);
        // Handle error (e.g., show a notification to the user)
      } finally {
        setUserLoading(false);
      }
    }
    fetchUserAccess();
  }, []);

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
    if (!phoneNumber && userHasAccess) {
      toast.error("Please enter your phone number");
      return;
    }
    if (
      customization.messaging.enabled &&
      !customization.messaging.consentGiven &&
      userHasAccess
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
    if (customization.horoscope.enabled && !customization.horoscope.sign) {
      toast.error("Please select a zodiac sign for horoscope");
      return;
    }
    if (customization.events.enabled && !customization.events.country) {
      toast.error("Please select a country for events");
      return;
    }
    if (customization.news.enabled && !customization.news.topic) {
      toast.error("Please select a topic for news");
      return;
    }
    if (
      customization.news.enabled &&
      customization.news.type === "customSearch" &&
      !customization.news.customQuery
    ) {
      toast.error("Please enter a custom query for news");
      return;
    }
    if (
      customization.weather.enabled &&
      !customization.weather.city &&
      !customization.weather.latitude &&
      !customization.weather.longitude
    ) {
      toast.error("Please enter a city or coordinates for weather");
      return;
    }
    if (customization.sports.enabled && !customization.sports.league) {
      toast.error("Please select a league for sports");
      return;
    }
    if (customization.sports.enabled && !customization.sports.teamId) {
      toast.error("Please select a team for sports");
      return;
    }
    if (
      customization.email.enabled &&
      !customization.email.consentGiven &&
      userHasAccess
    ) {
      toast.error(
        "Please give consent to receive emails or disable email messaging"
      );
      return;
    }

    if (customization.email.enabled && !customization.email.address) {
      toast.error("Please enter your email address");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      customization.email.enabled &&
      !emailRegex.test(customization.email.address)
    ) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (customization.email.enabled && !customization.email.deliveryTime) {
      toast.error("Please set an email delivery time");
      return;
    }

    let updatedCustomization = { ...customization };

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
          updatedCustomization = {
            ...updatedCustomization,
            weather: {
              ...updatedCustomization.weather,
              latitude: data[0].lat.toString(),
              longitude: data[0].lon.toString(),
            },
          };
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
        body: JSON.stringify({
          customization: updatedCustomization,
          phoneNumber: userHasAccess ? phoneNumber : "1234567890",
          deliveryTime,
        }),
      });

      if (response.ok) {
        toast.success("Changes saved!");
        // Update the state with the new customization
        setCustomization(updatedCustomization);
      } else {
        throw new Error("Failed to save changes");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes. Please try again.");
    }
  };

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
              {customization.news.includeLinks && (
                <span className="text-blue-500 underline">
                  https://tinyurl.com/goodmornin
                </span>
              )}
            </p>
            <p>
              * GoodMornin reaches 1,000 users!{" "}
              {customization.news.includeLinks && (
                <span className="text-blue-500 underline">
                  https://tinyurl.com/goodmornin
                </span>
              )}
            </p>
            <p>
              * GoodMornin helps you get your day started!{" "}
              {customization.news.includeLinks && (
                <span className="text-blue-500 underline">
                  https://tinyurl.com/goodmornin
                </span>
              )}
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

      {customization.sports.enabled && (
        <div>
          <h3 className="font-semibold">
            {customization.sports.type === "team"
              ? `${customization.sports.teamName} updates:`
              : `${customization.sports.league} Recap:`}
          </h3>
          {customization.sports.type === "team" && (
            <>
              {customization.sports.showPreviousGame && (
                <p>
                  * Last game: {customization.sports.teamName} 2 - [Opponent] 1
                </p>
              )}
              {customization.sports.showNextGame && (
                <p>* Next game: Tomorrow 12:00 PM vs [Opponent]</p>
              )}
            </>
          )}
          {customization.sports.type === "league" && (
            <>
              {customization.sports.recapTeams.map((team, index) => (
                <p key={index}>* {team} 2 - [Opponent] 1</p>
              ))}
            </>
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

      {customization.horoscope.enabled && (
        <div>
          <h3 className="font-semibold">Horoscope:</h3>
          <p>* Your {customization.horoscope.sign} horoscope for today.</p>
        </div>
      )}

      {customization.onThisDay.enabled && (
        <div>
          <h3 className="font-semibold">On This Day in History:</h3>
          <p>* 2024: GoodMornin launched!</p>
          <p>* 2025: GoodMornin reaches 1,000 users!</p>
          <p>* 2026: GoodMornin reaches 10,000 users!</p>
        </div>
      )}

      {customization.randomFact.enabled && (
        <div>
          <h3 className="font-semibold">Fun Fact:</h3>
          <p>The shortest war in history lasted 38 minutes.</p>
        </div>
      )}

      {customization.conclusion.text && <p>{customization.conclusion.text}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col text-neutral-700">
      <Nav />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 overflow-y-auto border-r border-neutral-200">
          <div className="p-6">
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-neutral-700">
              Customize Your Daily Text
            </h1>

            <Accordion type="multiple" className="w-full">
              <Settings
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
                userHasAccess={userHasAccess}
                userLoading={userLoading}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                deliveryTime={deliveryTime}
                setDeliveryTime={setDeliveryTime}
              />
              <Email
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
                userHasAccess={userHasAccess}
                userLoading={userLoading}
              />
              <Intro
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
              <News
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
              <Weather
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
              <Sports
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
                leagues={leagues}
                teams={teams}
                loadingTeams={loadingTeams}
                handleTeamChange={handleTeamChange}
              />
              <Quotes
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
              <Holidays
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
              <Horoscope
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
              <OnThisDay
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
              <Facts
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
              <Conclusion
                customization={customization}
                handleCustomizationChange={handleCustomizationChange}
              />
            </Accordion>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-6 sm:sticky md:top-16 md:max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-semibold">Preview Text</h2>
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
